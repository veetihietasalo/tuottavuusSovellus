# tuottavuusSovellus

Task and time tracking app (tuottavuussovellus = productivity app), the final project of a mobile course at a university of applied sciences, November 2023. Tasks are stored in Firebase Realtime Database and shown in three tabs: Dashboard, Tasks and Calendar.

- Tasks: every task with name, priority, deadline, category (Work, Study, Exercise, Leisure) and time used, with edit, save and delete. The deadline comes from a date picker. Time used is a number you type in, there is no timer.
- Add Task adds a task with default values (priority 1, deadline now, category Work, time used 3) that you then edit.
- Calendar: marks the days with a deadline. Tapping a day lists the tasks due that day.
- Dashboard: total tasks, the closest upcoming deadline, number of late tasks and a count per category. Each card opens to list the task names.

Known issue: new tasks get the name "Tehtävä NaN", because the Add Task button passes its press event to `addTask` instead of the task list.

Stack: React Native 0.72, Expo SDK 49, Firebase Realtime Database (`firebase` 10), React Navigation bottom tabs, React Native Elements (`@rneui`), `react-native-calendars`. Some UI text is in Finnish (Muokkaa = edit, Tallenna = save, Poista = delete). `docu` has the original feature list in Finnish.

## Run

```
npm install
npm start
```

Then open it in Expo Go, or use `npm run android` / `npm run ios`. The Firebase config is in `firebaseConfig.js` and points to the project used for the course. Store builds of Expo Go only support the latest Expo SDK, so running it on a phone now needs an SDK upgrade first.

Status: final project submitted 2023-11-27, README edits 2024-01-29, no code changes since.
