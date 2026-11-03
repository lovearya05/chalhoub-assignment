# First-time setup and delivery

## 1. Run the app locally

Open a terminal in this project. Use Node **22.16 or newer** (Node 22 LTS is suitable):

```sh
nvm use 22
npm ci
npm run dev
```

The launcher starts the catalog API on port 8787 and Expo on port 8081. The product data is fetched over HTTP; it is not imported into the runtime as a fixture. Press `w` for web, `i` for an installed iOS Simulator, or `a` for a configured Android emulator. For a physical phone, install an Expo Go version compatible with the project's SDK, connect to the same Wi-Fi, and scan the QR code. `npm run dev -- --web` opens the web target directly.

The launcher chooses a LAN address. If your machine has multiple interfaces/VPNs, create `.env.local` with `EXPO_PUBLIC_CATALOG_URL=http://YOUR-COMPUTER-WIFI-IP:8787/catalog.json`. The phone must be able to reach that address. If the SDK is newer than your store-installed Expo Go, use an emulator or the standalone preview builds in section 4. See [Expo's setup guide](https://docs.expo.dev/get-started/set-up-your-environment/).

Alternatively, run `npm run api` in one terminal and `npm start` in another. Web uses `http://localhost:8787/catalog.json` by default; Android emulator uses your LAN IP or `http://10.0.2.2:8787/catalog.json`; a physical device needs your LAN IP. Restart Expo after changing environment variables. The local HTTP API is for development; standalone delivery uses remote HTTPS.

The `MEN` seed category contains five products; the other categories display an empty state. Search for “teal”, select size/color, add to bag, inspect quantity/total, open a related product, enlarge its image and visit My account. Colors select a purchasable variant; the brief supplies one red hero, so swatches do not recolor the photograph.

## 2. Connect GitHub while preserving every step

Local Git is already initialized and each stage has its own branch. `main` contains the integrated result. Review history with:

```sh
git branch
git log --all --graph --oneline --decorate
git diff step-1/product-screen..step-2/state-management
```

Create a GitHub account if needed, then create an **empty repository** named `tiger-store`. Leave GitHub's “Add README”, license and gitignore options unchecked because those files/history already exist locally. Copy its HTTPS URL:

```sh
git remote add origin https://github.com/YOUR-USERNAME/tiger-store.git
git push -u origin main
git push origin --all
```

Authenticate through your normal GitHub credential flow; do not paste a token into a repository file. After pushing, confirm all six `step-*` branches appear on GitHub. Pushing only main preserves the commits but does not publish the branch names.

If private, use GitHub repository Settings → Collaborators to invite **daniel-rosiak** and **white-space-dev**, as requested by the brief. No remote has been created, no pushes have been made, and no collaborators have been invited during this implementation.

For subsequent work, use focused Conventional Commit messages such as `feat: add stock availability` and `fix: handle unavailable image`, and commit after each working change. Do not squash away the assignment stages.

## 3. Host the product data remotely (required for step 3 delivery)

Create a dedicated AWS S3 bucket for the assignment's public sample assets, or use an equivalent GCP bucket. Upload both files from `public/data/` to the same folder: `catalog.json` and `task.png`. JSON image URLs are relative and resolve against the catalog URL. You can replace an image URL with an individual high-resolution product photo and remove that product's `crop` field.

For a direct S3 HTTPS endpoint:

1. Create an AWS account/bucket in your chosen region. Use a dedicated bucket containing only these sample files.
2. Upload the files in the S3 console (or `aws s3 cp public/data/ s3://YOUR-BUCKET/ --recursive` after configuring AWS CLI).
3. Allow anonymous `s3:GetObject` for **only these two public objects** using a bucket policy. Direct anonymous access requires the relevant bucket/account Block Public Access settings to permit the policy. Keep ACLs disabled. If your account policy disallows public buckets, use CloudFront with a private S3 origin instead. AWS explains [public read policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html).
4. To support the web preview, add this read-only [CORS configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html) in the bucket Permissions tab:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 300
  }
]
```

Example bucket policy (replace both bucket names):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadAssignmentAssets",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": ["arn:aws:s3:::YOUR-BUCKET/catalog.json", "arn:aws:s3:::YOUR-BUCKET/task.png"]
    }
  ]
}
```

Open `https://YOUR-BUCKET.s3.YOUR-REGION.amazonaws.com/catalog.json` and the matching `task.png` URL in a signed-out browser. Both must return successfully without credentials. Use the HTTPS object endpoint rather than the HTTP website endpoint. AWS/GCP and EAS services may incur charges depending on your account/usage.

Copy `.env.example` to `.env.local`, replace the placeholder with the real JSON URL, and restart Expo with `npm start -- --clear`. Test again with `npm run api` stopped to prove the app uses the remote data. Never include AWS keys in the app: `EXPO_PUBLIC_*` values are visible to app users.

No bucket was deployed here because the user has not created a hosting setup. Record the real catalog URL in the delivery table below once deployed.

## 4. Create the Expo project and native builds (bonus step 6)

Create an account at [expo.dev](https://expo.dev), then run from this project:

```sh
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest update:configure
```

`init` creates/links the project and writes `extra.eas.projectId` into `app.json`. `update:configure` writes `updates.url`. If that command changes the runtime policy, restore `"runtimeVersion": { "policy": "fingerprint" }` so installed binaries accept compatible updates. Commit the resulting real configuration. See [Expo Update setup](https://docs.expo.dev/eas-update/getting-started/) and [runtime compatibility](https://docs.expo.dev/eas-update/runtime-versions/).

The app's initial package/bundle identifier is `com.lovepreet.tigerstore`. Change it in `app.json` and `.maestro/*.yaml` before your first build if you want a different identifier. The starter's generic app icons are retained; the product page uses the reference artwork.

Create the remote URL in Expo's **preview** environment. This must be set in Expo, not only your ignored local `.env.local`, so cloud builds and OTA updates receive it:

```sh
npx eas-cli@latest env:set --environment preview --name EXPO_PUBLIC_CATALOG_URL --value https://YOUR-BUCKET.s3.YOUR-REGION.amazonaws.com/catalog.json --visibility plaintext
npm run release:check
npm run typecheck
npm test -- --runInBand
npx eas-cli@latest build --platform all --profile preview
```

`release:check` reads `.env.local`; the cloud build hook checks Expo's environment. Both reject an unlinked project or a missing/local/insecure catalog URL. The check validates configuration, not remote availability: verify the JSON and artwork URLs yourself.

The `preview` profile builds an installable **Android APK** and an **iOS Simulator .app archive**. A simulator build does not require Apple Developer membership, but needs a Mac/Xcode simulator to run. It cannot install on an iPhone. For a physical iPhone, register the device with `npx eas-cli@latest device:create` and use `npx eas-cli@latest build --platform ios --profile preview-device`; this requires appropriate Apple Developer signing/provisioning. See [iOS simulator builds](https://docs.expo.dev/build-reference/simulators/) and [internal distribution](https://docs.expo.dev/build/internal-distribution/).

Follow EAS's build prompts for signing. Copy the finished build URLs from its dashboard. Install the builds and run the manual checks in [TESTING.md](TESTING.md). Only label a build successful after EAS reports it finished and the downloaded build launches correctly.

## 5. Publish and verify an OTA update

After a preview binary is installed, make a small visible JavaScript change, test it and commit it. Keep the same native dependencies/runtime, then publish:

```sh
npx eas-cli@latest update --channel preview --environment preview --message "feat: refine product page copy"
```

Reopen the installed preview app with an internet connection, allow the update to download, then close/reopen it again to apply. Confirm the visible change on both platforms and record the update URL. Expo Go does not verify your standalone preview channel. Native dependency changes require a new compatible build; fingerprint policy helps enforce that. Always use the same environment for builds and updates. See [Expo environment usage](https://docs.expo.dev/eas/environment-variables/usage/).

The `production` profile is available for store builds. Configure `EXPO_PUBLIC_CATALOG_URL` in the production environment before using it. Store submission is separate from this assignment's preview delivery.

## 6. Delivery record

Replace pending entries with real links/results after the corresponding action succeeds. Do not submit configuration as evidence of completed cloud builds.

| Deliverable                               | Current status / URL                      |
| ----------------------------------------- | ----------------------------------------- |
| Local application and six step branches   | Implemented                               |
| GitHub repository and all branches pushed | Pending account/repository setup          |
| Private repository collaborator invites   | Pending if repository is private          |
| Remote catalog JSON URL                   | Pending bucket setup/upload               |
| Android APK build URL + install result    | Pending Expo project/build                |
| iOS Simulator build URL + launch result   | Pending Expo project/build                |
| iPhone build URL, if requested            | Pending Apple signing/device registration |
| Preview OTA update URL + verification     | Pending compatible installed builds       |
| Device/visual acceptance checklist        | Pending manual run                        |

Commit the final delivery record and push the updated history before sending the repository to the reviewers.
