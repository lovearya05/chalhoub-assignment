# Setup and delivery

Complete these steps in order. Replace `YOUR-*` values with your own details.

## 1. Run locally

Use the commands in the [README](../README.md#run). `npm run dev` starts Expo and the catalog API together.

If your phone cannot load products, put your computer's Wi-Fi IP in `.env.local`, then restart Expo:

```dotenv
EXPO_PUBLIC_CATALOG_URL=http://YOUR-COMPUTER-IP:8787/catalog.json
```

Keep both devices on the same Wi-Fi. If Expo Go does not support this SDK, use a compatible emulator or a preview build from step 4.

## 2. Push to GitHub

Create an **empty** GitHub repository. Do not add a README, license or gitignore there. Then run:

```sh
git remote add origin https://github.com/YOUR-USERNAME/tiger-store.git
git push -u origin main
git push origin --all
```

Check that all six step branches appear on GitHub. If private, invite `daniel-rosiak` and `white-space-dev` under repository Settings → Collaborators.

## 3. Host the catalog

1. Create a dedicated AWS S3 or GCP bucket for the sample assets.
2. Upload `public/data/catalog.json` and `public/data/task.png` to the same folder.
3. Give those two objects public read access. For S3, follow [the bucket policy guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html); public access settings must allow that policy.
4. For web access, add a [CORS rule](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html) allowing `GET` and `HEAD` from `*`.
5. Open both HTTPS object URLs in a signed-out browser to confirm they work.
6. Copy `.env.example` to `.env.local` and set the real catalog URL:

```dotenv
EXPO_PUBLIC_CATALOG_URL=https://YOUR-BUCKET.s3.YOUR-REGION.amazonaws.com/catalog.json
```

Stop the local API, then run `npm start -- --clear`. Products should load from the bucket. Never put cloud credentials in `EXPO_PUBLIC_*` variables; those values are visible in the app.

## 4. Create the Expo project and builds

Create an account at [expo.dev](https://expo.dev), then run:

```sh
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest update:configure
```

In `app.json`, keep `runtimeVersion` set to `{ "policy": "fingerprint" }`. Commit the project ID and update URL added by these commands.

Set the same remote catalog URL in Expo's preview environment, then build:

```sh
npx eas-cli@latest env:set --environment preview --name EXPO_PUBLIC_CATALOG_URL --value https://YOUR-BUCKET.s3.YOUR-REGION.amazonaws.com/catalog.json --visibility plaintext
npm run release:check
npx eas-cli@latest build --platform all --profile preview
```

The preview profile creates an **Android APK** and an **iOS Simulator build**. Download and launch both. The iOS build needs a Mac with Xcode and cannot run on an iPhone.

For an iPhone, register it with `npx eas-cli@latest device:create`, then build with `--platform ios --profile preview-device`. Apple Developer signing is required. See [Expo's distribution guide](https://docs.expo.dev/build/internal-distribution/).

## 5. Publish an OTA update

With a preview build installed, make a small visible JavaScript change, test it and commit it. Then run:

```sh
npx eas-cli@latest update --channel preview --environment preview --message "feat: refine product page copy"
```

Open the installed app to download the update, then close and reopen it to check the change. Test both platforms. Native dependency changes need a new compatible build; Expo Go does not verify this preview channel.

## 6. Before submitting

All items below are currently pending:

- [ ] GitHub URL, all step branches pushed, and private-repo invites if needed.
- [ ] Working remote catalog and image URLs.
- [ ] Android and iOS build links, with successful launch checks.
- [ ] OTA update link, verified on installed builds.
- [ ] [Manual test checklist](TESTING.md#manual-checks) completed.

Add the finished links here, commit the changes and push them before sharing the repository.
