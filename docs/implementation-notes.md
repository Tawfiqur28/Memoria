# Implementation Notes

## Incoming Call Interception

- `react-native-callkeep` is wired in `apps/patient-mobile/App.tsx`.
- Full pre-answer overlays and telecom integrations require a custom development build or bare workflow on Android.
- In Expo Go, telecom hooks may be limited.

## Voice Loop

- Current implementation directly calls Whisper, Claude, and ElevenLabs from mobile for prototype speed.
- For production, move AI requests to a secure backend so API keys are never exposed on device.

## Desktop Wake Phrase

- Electron tray shell exists in `apps/desktop-agent`.
- Add wake-word engine (e.g. Porcupine/Vosk) in `main.js`.
