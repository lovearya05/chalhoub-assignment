# Tiger Store

An Expo / React Native shopping app built with TypeScript and Zustand, based on [this layout](layout/task.png).

## Run

Requires Node **22.16+**.

```sh
nvm use 22
npm ci
npm run dev
```

Press **w** for web, **i** for iOS Simulator, or **a** for Android emulator. For Expo Go, use a compatible version and connect your phone to the same Wi-Fi. The command starts both Expo and the local catalog API.

## What works

- Product search, category filters, size/color selection and image zoom.
- Shopping bag with quantities, removal and totals.
- Product data loaded over HTTP; account data from the Rick and Morty API.
- Loading states, error messages and retry actions.

The sample catalog has five MEN products. Other categories are empty. Images come from the reference screenshot, so enlarged thumbnails look blurry. Colors select a variant without changing the photo. The bag resets when the app restarts; checkout is outside scope.

## Check the app

```sh
npm run typecheck
npm test -- --runInBand
npm run format:check
npx expo export --platform all
```

Last checked: **26 tests passed**, along with TypeScript, formatting and bundle exports. Device and visual checks are still pending. See [test scenarios](docs/TESTING.md).

## Project history and status

Each assignment step has its own `step-1` through `step-6` branch. `main` contains the combined result. See [the branch list and decisions](docs/PROGRESS.md).

The catalog is hosted on GitHub and the Expo project is linked. Native builds and OTA publication are pending. AWS/GCP hosting has not been configured.

See [developer setup](docs/SETUP.md) for environment and build instructions, and [the assignment summary](docs/ASSIGNMENT.md) for requirements.
