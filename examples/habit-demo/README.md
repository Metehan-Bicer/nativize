# habit-demo

The example behind the screenshots in the main README: one habit tracker home screen written the way a model usually writes it (`src/BeforeHome.tsx`) and the same screen after a nativize pass (`src/AfterHome.tsx`).

```bash
npm install
EXPO_PUBLIC_SCREEN=before npx expo run:ios --configuration Release
EXPO_PUBLIC_SCREEN=after  npx expo run:ios --configuration Release
```

Scan both:

```bash
node ../../skills/nativize/scripts/scan.mjs src/BeforeHome.tsx
node ../../skills/nativize/scripts/scan.mjs src/AfterHome.tsx
```
