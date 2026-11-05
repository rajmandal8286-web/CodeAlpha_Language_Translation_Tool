# Lingo

Lingo is a lightweight web-based translator app built with plain HTML, CSS, and JavaScript. It lets users:

- choose source and target languages
- detect the source language automatically
- translate text using the MyMemory translation API
- copy the translated result
- listen to the input or output with browser text-to-speech
- swap languages quickly

## Project structure

- `index.html` — app layout and UI structure
- `style.css` — styling for the translator interface
- `main.js` — language list, translation logic, speech synthesis, and UI interactions

## Features

- Multi-language translation support
- Responsive layout for desktop and mobile screens
- Auto-detected language input
- Character counter for up to 500 characters
- Translation history support in the UI styling (ready for use with future logic)
- Speech playback for both source text and translated output

## How to run

Because this is a static frontend project, you can run it in any of the following ways:

1. Open `index.html` directly in a browser, or
2. Serve the project locally with a simple static server, for example:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Notes

- The app uses the public MyMemory translation API.
- Browser support for speech synthesis is required for the audio features.
- Translation depends on internet access and the availability of the external translation service.

## Screenshots

The app presents a modern, pastel UI with a translator card, language selectors, input and output panes, and action buttons for copy and speak.

## License

This project is currently unlicensed.
