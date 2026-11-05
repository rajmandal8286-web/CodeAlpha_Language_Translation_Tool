# Lingo

A small, browser-based translator for translating text between 16 languages. Lingo also includes text-to-speech playback, copy-to-clipboard, and automatic source-language detection.

## Use it

Open `index.html` in a modern browser, enter up to 500 characters, choose the source and target languages, then select **Translate**. Press **Ctrl + Enter** to translate from the keyboard.

No build step or package installation is required. Translation uses the [MyMemory Translation API](https://mymemory.translated.net/); an internet connection is needed. Text-to-speech and clipboard features depend on browser support.

## Languages

English, Hindi, Bengali, Tamil, Telugu, Urdu, Spanish, French, German, Italian, Portuguese, Russian, Arabic, Japanese, Korean, and Simplified Chinese.

## Project files

- `index.html` — page structure and translator controls
- `style.css` — layout and responsive styles
- `main.js` — language selection, translation, and browser features
