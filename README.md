# Tiger Store

An Expo / React Native shopping app written in TypeScript, based on [layout/task.png](layout/task.png). It includes the product page, a shopping bag and an API-backed account screen.

**Start here:** [First-time setup and delivery guide](docs/SETUP.md). It walks through running the app, creating GitHub/Expo projects, hosting the catalog, building both platforms and publishing an OTA update.

## Run locally

Use Node **22.16+** and npm. From this folder:

```sh
nvm use 22
npm ci
npm run dev
```

Press **w** for web, **i** for iOS Simulator or **a** for Android emulator. For Expo Go, use a compatible SDK version and connect the phone and computer to the same Wi-Fi. The development launcher runs both Expo and the HTTP catalog server, and chooses a LAN address for the API. Override it with `EXPO_PUBLIC_CATALOG_URL` in `.env.local` if needed.

For separate terminals, use `npm run api` and `npm start`. `npm run web` starts only Expo, so the API must already be running. Remote hosting setup is in [docs/SETUP.md](docs/SETUP.md#3-host-the-product-data-remotely-required-for-step-3-delivery).

## Features and decisions

- Product photo, title, price, sizes, colors, description and related products load from HTTP JSON.
- Category filters and case-insensitive search; explicit empty states for categories without sample products.
- Size/color selection, required-selection feedback, image enlargement and a working shopping bag with variant quantities, removal and total.
- Zustand holds shared product selection, navigation and bag state. Form inputs stay local. Bag contents reset on application restart.
- My account loads character 1 from the [Rick and Morty API](https://rickandmortyapi.com/documentation/#get-a-single-character), with refresh and retry.
- Loading/error states, 12-second request timeout, response validation and product-image retry.
- Native safe areas, accessible control labels and a centered responsive web layout.

The sample catalog contains five MEN products. Other categories display an empty state. The supplied screenshot provides the artwork: the image component crops only its photo regions at render time, while the entire interface is implemented with React Native components. Small related thumbnails are low resolution when enlarged. Replace them with full-resolution product URLs and omit `crop` for production images. Color swatches select variants and do not alter the supplied photo. The blank reference action is labelled **ADD TO BAG**; account and bag links are deliberate additions. No checkout or identity system is included.

## Incremental Git history

Each required step has its own branch and descriptive commits. The branches are cumulative so each stage builds on the previous stage. `main` integrates the final result while retaining all commits and branch references.

| Assignment stage | Branch                    | Result                                                                    |
| ---------------- | ------------------------- | ------------------------------------------------------------------------- |
| Step 1: layout   | `step-1/product-screen`   | Interactive product page from the reference                               |
| Step 2: state    | `step-2/state-management` | Typed Zustand shopping store                                              |
| Step 3: API      | `step-3/remote-catalog`   | HTTP JSON/image loading, validation, local API; remote deployment pending |
| Step 4: account  | `step-4/my-account`       | Rick and Morty profile screen                                             |
| Step 5: tests    | `step-5/testing`          | Unit/integration tests, scenarios, Maestro flows and CI                   |
| Step 6: bonus    | `step-6/eas-delivery`     | EAS profiles, Expo Updates and setup guide; cloud execution pending       |

```sh
git log --all --graph --oneline --decorate
git diff step-1/product-screen..step-2/state-management
```

To run an older stage, switch to its branch and run `npm ci` to match that stage's dependencies. No GitHub remote exists yet. Follow [the GitHub setup instructions](docs/SETUP.md#2-connect-github-while-preserving-every-step) and push **all branches**, so reviewers can inspect every stage. If private, invite `daniel-rosiak` and `white-space-dev`.

## Verification

```sh
npm run typecheck
npm test -- --runInBand --coverage
npm run format:check
npx expo export --platform all
```

The current suite has **26 passing tests across 4 suites**, covering catalog contracts, request failures/timeouts, shopping state and app flows. Line coverage measured at step 5 was **92.71%**. GitHub Actions runs type checks, formatting, tests and Android/iOS/web bundle exports once the repository is pushed.

[docs/TESTING.md](docs/TESTING.md) contains automated coverage, proposed Maestro flows and the manual acceptance checklist. Browser automation was unavailable, so visual comparison and native device checks are still pending. An export validates bundling; it is not a signed iOS/Android build.

## Delivery status

Local code, commits and all six stage branches are prepared. **Remote bucket upload, GitHub pushes, signed/native EAS builds and OTA publishing have not been performed.** The user has not created the necessary accounts/projects yet. EAS configuration alone does not complete the bonus or the requested build delivery. Complete [the setup guide and delivery record](docs/SETUP.md#6-delivery-record) before submission.

`eas.json` provides preview APK/iOS Simulator builds, an iPhone profile requiring signing, and production store builds. `expo-updates` is installed; link a real project and configure its update URL before building. A release check rejects missing Expo linking or a missing/local/non-HTTPS catalog URL. Cloud builds use the same check.

## Project map

```text
App.tsx                 screen switching and safe-area shell
src/screens/            product page and account screen
src/components/         product artwork and request-state feedback
src/store/              Zustand shopping and catalog stores
src/api/                HTTP client and response validation
src/types/              shared product/cart contracts
public/data/            catalog.json and supplied artwork for HTTP hosting
scripts/                local API, development launcher, release checks
__tests__/              Jest unit/integration suites
.maestro/               proposed native functional flows
.github/workflows/      CI verification
```

See [the original assignment](docs/ASSIGNMENT.md), [implementation decisions](docs/PROGRESS.md), [testing](docs/TESTING.md) and [first-time setup](docs/SETUP.md).
