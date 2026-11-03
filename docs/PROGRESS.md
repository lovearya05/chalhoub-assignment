# Implementation notes

Each branch builds on the previous one. `main` combines all stages without removing their history.

| Step | Branch                    | Work done                                                                          |
| ---- | ------------------------- | ---------------------------------------------------------------------------------- |
| 1    | `step-1/product-screen`   | Built the layout and shopping interactions.                                        |
| 2    | `step-2/state-management` | Added a typed Zustand store.                                                       |
| 3    | `step-3/remote-catalog`   | Added HTTP catalog loading, validation and retry. GitHub hosts the sample catalog. |
| 4    | `step-4/my-account`       | Added the Rick and Morty profile screen.                                           |
| 5    | `step-5/testing`          | Added tests, CI and device test scenarios.                                         |
| 6    | `step-6/eas-delivery`     | Prepared EAS builds and OTA configuration. The Expo project is linked.             |

## Main decisions

- Used Zustand for the small shared state: selected product, navigation and bag.
- Kept search and form inputs local. Bag state survives navigation but resets on restart.
- Used the supplied artwork to match the reference. Full-size product photos would improve enlarged thumbnails.
- Labelled the blank reference button “ADD TO BAG” and added account/bag links.
- Loaded every product field over HTTP. A local API makes development possible before cloud hosting is ready.

## Deployment status

The catalog is hosted on GitHub and the Expo project is linked. AWS/GCP hosting, native builds, OTA publication and device/visual checks are pending. Local verification is complete. See [developer setup](SETUP.md) for environment details.

To inspect the work:

```sh
git log --all --graph --oneline --decorate
```
