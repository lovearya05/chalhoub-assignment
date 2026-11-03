# Implementation notes

Each branch builds on the previous one. `main` combines all stages without removing their history.

| Step | Branch                    | Work done                                                                          |
| ---- | ------------------------- | ---------------------------------------------------------------------------------- |
| 1    | `step-1/product-screen`   | Built the layout and shopping interactions.                                        |
| 2    | `step-2/state-management` | Added a typed Zustand store.                                                       |
| 3    | `step-3/remote-catalog`   | Added HTTP catalog loading, validation and retry. GitHub hosts the sample catalog. |
| 4    | `step-4/my-account`       | Added the Rick and Morty profile screen.                                           |
| 5    | `step-5/testing`          | Added tests, CI and device test scenarios.                                         |
| 6    | `step-6/eas-delivery`     | Published Android/iOS Simulator builds and matching baseline OTA updates.          |

## Main decisions

- Used Zustand for the small shared state: selected product, navigation and bag.
- Kept search and form inputs local. Bag state survives navigation but resets on restart.
- Used the supplied artwork to match the reference. Full-size product photos would improve enlarged thumbnails.
- Labelled the blank reference button “ADD TO BAG” and added account/bag links.
- Loaded every product field over HTTP. A local API makes development possible before cloud hosting is ready.

## Deployment status

The catalog is hosted on GitHub. Android APK and iOS Simulator builds finished successfully; artifacts were downloaded and checked. Published OTA updates match each build's native runtime and are served by the preview update endpoint.

The Android OTA was published from its exact build revision after the CLI changed iOS config during the combined build. Device/visual checks and OTA application on an installed app remain pending. AWS/GCP hosting is not configured. See [the README](../README.md#project-history-and-status) for links.

To inspect the work:

```sh
git log --all --graph --oneline --decorate
```
