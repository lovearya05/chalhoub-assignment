# Developer setup

## Run locally

Requires Node **22.16+**. From the project folder:

```sh
npm ci
npm run dev
```

Press **w** for web, **i** for iOS Simulator, or **a** for Android emulator. The launcher starts Expo and the local catalog API on port 8787.

For Expo Go, use a compatible version and keep the phone and computer on the same Wi-Fi. If products fail to load, set the computer's Wi-Fi IP in `.env.local` and restart:

```dotenv
EXPO_PUBLIC_CATALOG_URL=http://COMPUTER-IP:8787/catalog.json
```

## Use a remote catalog

Copy `.env.example` to `.env.local` to use the public GitHub catalog, then run `npm start -- --clear`. The local API is not needed in this mode.

To host the sample data, upload both files in `public/data/` to the same folder on S3 or GCP. Allow public reads for these sample objects and `GET`/`HEAD` CORS access for web clients. Image paths resolve relative to the JSON URL. Cloud credentials must never appear in `EXPO_PUBLIC_*` values.

## Build and update

EAS builds require a linked Expo project, a configured update URL and a remote catalog URL in both `.env.local` and the EAS `preview` environment. Keep `runtimeVersion.policy` set to `fingerprint`.

```sh
npm run release:check
npx eas-cli@latest build --platform all --profile preview
```

| Profile          | Output                                               |
| ---------------- | ---------------------------------------------------- |
| `preview`        | Android APK and iOS Simulator build                  |
| `preview-device` | Physical-device build; iPhone requires Apple signing |
| `production`     | Store builds using the production environment        |

An iOS Simulator build runs on a Mac with Xcode, not on an iPhone.

Publish a compatible JavaScript update to the preview builds with:

```sh
npx eas-cli@latest update --channel preview --environment preview --message "Describe the change"
```

Reopen the installed app to download the update, then relaunch to apply it. Native dependency changes require a new compatible build.

See [testing](TESTING.md) for verification commands and device scenarios. Published preview builds and OTA links are in the [README](../README.md#project-history-and-status). Installed-app checks remain pending. The catalog uses GitHub instead of AWS/GCP.
