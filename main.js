
const LANGS = [
  { code: "en", name: "English",              voice: "en-US" },
  { code: "hi", name: "Hindi",                voice: "hi-IN" },
  { code: "bn", name: "Bengali",              voice: "bn-IN" },
  { code: "ta", name: "Tamil",                voice: "ta-IN" },
  { code: "te", name: "Telugu",               voice: "te-IN" },
  { code: "ur", name: "Urdu",                 voice: "ur-PK" },
  { code: "es", name: "Spanish",              voice: "es-ES" },
  { code: "fr", name: "French",               voice: "fr-FR" },
  { code: "de", name: "German",               voice: "de-DE" },
  { code: "it", name: "Italian",              voice: "it-IT" },
  { code: "pt", name: "Portuguese",           voice: "pt-PT" },
  { code: "ru", name: "Russian",              voice: "ru-RU" },
  { code: "ar", name: "Arabic",               voice: "ar-SA" },
  { code: "ja", name: "Japanese",             voice: "ja-JP" },
  { code: "ko", name: "Korean",               voice: "ko-KR" },
  { code: "zh", name: "Chinese (Simplified)", voice: "zh-CN", api: "zh-CN" }
];

const GREETINGS = ["Hello", "नमस्ते", "নমস্কার", "Hola", "Bonjour", "こんにちは", "Ciao", "안녕하세요", "வணக்கம்", "Hallo", "مرحبا", "Olá"];

const $ = (id) => document.getElementById(id);
const sourceEl = $("source"), targetEl = $("target");
const inputEl = $("input"), outputEl = $("output");
const statusEl = $("status"), translateBtn = $("translate");

let translated = "";
let translatedLang = "hi";


sourceEl.innerHTML =
  '<option value="auto">Detect language</option>' +
  LANGS.map((l) => `<option value="${l.code}">${l.name}</option>`).join("");
targetEl.innerHTML = LANGS.map((l) => `<option value="${l.code}">${l.name}</option>`).join("");
sourceEl.value = "en";
targetEl.value = "hi";

const findLang = (code) => LANGS.find((l) => l.code === code);


let g = 0;
const helloEl = $("hello");
setInterval(() => {
  g = (g + 1) % GREETINGS.length;
  helloEl.textContent = GREETINGS[g];
  helloEl.classList.remove("swap-in");
  void helloEl.offsetWidth;            
  helloEl.classList.add("swap-in");
}, 2200);


function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}

function showResult(text) {
  translated = text;
  outputEl.textContent = text || "Your translation shows up here.";
  outputEl.classList.toggle("placeholder", !text);
  $("copy").disabled = $("speakOut").disabled = !text;
}

inputEl.addEventListener("input", () => {
  $("count").textContent = `${inputEl.value.length} / 500`;
});

inputEl.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") translateBtn.click();
});

$("clear").addEventListener("click", () => {
  inputEl.value = "";
  inputEl.dispatchEvent(new Event("input"));
  showResult("");
  $("detected").textContent = "";
  setStatus("");
  inputEl.focus();
});

$("swap").addEventListener("click", () => {
  const from = sourceEl.value === "auto" ? targetEl.value : sourceEl.value;
  const to = targetEl.value;
  sourceEl.value = to;
  targetEl.value = from;
  if (translated) {
    inputEl.value = translated;
    inputEl.dispatchEvent(new Event("input"));
    showResult("");
  }
});


$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(translated);
    setStatus("Copied to clipboard.");
    setTimeout(() => setStatus(""), 1800);
  } catch {
    setStatus("Couldn’t copy. Select the text and copy it manually.", true);
  }
});

function speak(text, langCode) {
  if (!("speechSynthesis" in window)) {
    setStatus("Your browser doesn’t support text-to-speech.", true);
    return;
  }
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = (findLang(langCode) || {}).voice || "en-US";
  speechSynthesis.speak(utter);
}

$("speakOut").addEventListener("click", () => speak(translated, translatedLang));
$("speakIn").addEventListener("click", () => {
  if (inputEl.value.trim()) speak(inputEl.value, sourceEl.value === "auto" ? "en" : sourceEl.value);
});

/* ---------- Translate ---------- */
translateBtn.addEventListener("click", async () => {
  const text = inputEl.value.trim();
  if (!text) { setStatus("Enter some text to translate.", true); return; }
  if (sourceEl.value === targetEl.value) { showResult(text); setStatus("Both languages are the same."); return; }

  translateBtn.disabled = true;
  translateBtn.textContent = "Translating…";
  setStatus("");

  try {
    const { text: result, detected } = await translateText(text, sourceEl.value, targetEl.value);
    showResult(result);
    translatedLang = targetEl.value;
    $("detected").textContent = detected ? `Detected: ${detected}` : "";
  } catch (err) {
    setStatus(err.message || "Translation failed. Check your connection and try again.", true);
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "Translate";
  }
});

/* ---------- API call  ---------- */
async function translateText(text, from, to) {
  const apiCode = (c) => (findLang(c) || {}).api || c;
  const pair = `${from === "auto" ? "Autodetect" : apiCode(from)}|${apiCode(to)}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("The translation service is unavailable right now.");
  const data = await res.json();

  if (Number(data.responseStatus) !== 200) {
    throw new Error(data.responseDetails || "The translation service returned an error.");
  }

  const detectedCode = data.responseData.detectedLanguage;
  const detected = detectedCode ? (findLang(detectedCode.split("-")[0]) || {}).name || detectedCode : "";
  return { text: data.responseData.translatedText, detected };
}


