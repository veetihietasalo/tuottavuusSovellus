# tuottavuusSovellus

Task and time tracking app (tuottavuussovellus = productivity app), the final project of a mobile course at a university of applied sciences, November 2023. Tasks are stored in Firebase Realtime Database, or locally in demo mode, and shown in three tabs: Dashboard, Tasks and Calendar. Runs on a phone and as a web page.

- Tasks: every task with name, priority, deadline, category (Work, Study, Exercise, Leisure) and time used, with edit, save and delete. The deadline comes from a date picker. Time used is a number you type in, there is no timer.
- Add Task adds a task named "Tehtävä N" with default values (priority 1, deadline now, category Work, time used 3) that you then edit.
- Calendar: marks the days with a deadline. Tapping a day lists the tasks due that day.
- Dashboard: total tasks, the closest upcoming deadline, number of late tasks and a count per category. Each card opens to list the task names.

Stack: React Native 0.72, Expo SDK 49, Firebase Realtime Database (`firebase` 10), React Navigation bottom tabs, React Native Elements (`@rneui`), `react-native-calendars`, react-native-web for the web build. Some UI text is in Finnish (Muokkaa = edit, Tallenna = save, Poista = delete). `docu` has the original feature list in Finnish.

Run it on a phone:

```
npm install
npm start
```

`npm run android` and `npm run ios` are in `package.json` too. Expo Go from the app stores only runs the latest SDK, so running it on a phone now needs an SDK upgrade first.

Demo mode: the course Firebase project is deleted, so by default the app runs without Firebase and shows "Demo mode: data stays on this device." The tasks are kept in the browser's localStorage on the web and in memory on a phone, so on a phone they're gone when the app closes. `firebaseTasks.js` picks Firebase or the local list, the rest of the app doesn't know the difference.

Firebase: copy `.env.example` to `.env`, fill in the seven `EXPO_PUBLIC_FIREBASE_*` values from a Firebase web app config (Firebase console, Project settings, Your apps) for a project with a Realtime Database, and restart with `npx expo start --clear`. `.env` is git-ignored. If only some of the values are set, the app warns with the missing names and stays in demo mode.

Firebase web config values are identifiers, not secrets: Expo writes them into every build of the app. What protects the data is the Realtime Database rules. The app has no sign-in and every user shares `/tasks`, so rules that let it work also let anyone with the config read and write all tasks. Fine for a course demo, not for real data.

Web build:

```
npm run build:web     # static site in dist/
npm run deploy:web    # build:web, then push dist/ to the gh-pages branch
```

`build:web` runs `expo export --platform web` and then `scripts/web-relative-paths.js`, which makes the paths relative (SDK 49 has no base URL setting) and writes `.nojekyll`, so the site works from `https://veetihietasalo.github.io/tuottavuusSovellus/`. `deploy:web` runs `scripts/deploy-web.sh`, which builds the gh-pages branch from `dist/` only and pushes it without force. GitHub Pages has to be set to the gh-pages branch once in the repo settings. Build it without a `.env`, so the public site runs in demo mode. To try the build locally, copy `dist/` to `site/tuottavuusSovellus/`, run `python3 -m http.server -d site` and open `http://localhost:8000/tuottavuusSovellus/`.

Two web-only files: `DeadlinePicker.web.js` is a plain date input, since the community date picker renders nothing on the web, and `webAssetPaths.web.js` makes the icon font URLs relative, since expo-asset builds them from the domain root.

Review, Oct 2026:
- The Firebase config was hard-coded in `firebaseConfig.js`. It now comes from `EXPO_PUBLIC_FIREBASE_*`, and without it the app runs in demo mode. measurementId is dropped, the app never starts Analytics. The old values are in git history, the project is gone.
- New tasks were named "Tehtävä NaN": the Add Task button passed its press event to `addTask`. Fixed.
- Emptying Prioriteetti or Aikaa käytetty and pressing Tallenna sent NaN to Firebase, and `set()` throws on NaN. An empty field now keeps the old value.
- A Dashboard effect read `categoryTotals` before it was declared. It only worked because Babel turns `const` into `var`, so it ran once on mount and did nothing useful. Removed.
- The `/tasks` listeners are unsubscribed on unmount, and Dashboard uses the same `fetchTasks` as the other screens.
- Unused packages removed: mui 0.0.1 (an unrelated 2014 package), @mui/material, @rneui/themed, @react-navigation/drawer, @react-navigation/native-stack. moment is a direct dependency now (^2.31.0).

Still open:
- No sign-in, see above. A real version needs Firebase Auth and rules per user.
- `Task.js` returns early before its hooks (`if (!task) return null`), which breaks the rules of hooks. TaskList always passes a task so it never fires. Fixing it means splitting the component.
- Task names count from the list length, so after a delete two tasks can get the same number.
- `npx expo install --check` wants @react-native-picker/picker 2.4.10 (we have 2.5.1), react-native-safe-area-context 4.6.3 (4.7.4), react-native-screens ~3.22.0 (3.27.0) and react-native 0.72.10 (0.72.6). Not changed, since we can't test on a device. npm audit lists advisories in the SDK 49 tree. The fix is an SDK upgrade.
- No tests. Not run on a phone or emulator in this review, only bundled with `npx expo export` for Android, iOS and the web. The web build was checked in headless Chromium in demo mode. The Firebase path wasn't run, there's no project to run it against.

Status: final project submitted 2023-11-27, README edits 2024-01-29. Config moved out, review fixes, demo mode and web build in October 2026.
