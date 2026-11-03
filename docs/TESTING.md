# Testing

## Automated checks

```sh
npm run typecheck
npm test -- --runInBand --coverage
npm run format:check
npx expo export --platform all
```

Last run: **26 tests passed in 4 suites**, with **92.71% line coverage**. TypeScript, formatting and Android/iOS/web bundle exports also passed. The GitHub Actions workflow runs these checks on pushes and pull requests.

Jest and React Native Testing Library cover:

- Invalid catalog data, duplicate IDs and image URLs.
- Network errors, malformed responses and request timeouts.
- Required size/color selection, bag quantities, totals and removal.
- Search, category filters, related products and image zoom.
- Account loading, refresh, navigation and retry.

Tests mock HTTP responses so they can run without the live APIs.

## Manual checks

- [ ] Compare the page with `layout/task.png` on a phone-sized screen.
- [ ] Check scrolling, larger text and screen-reader labels.
- [ ] Try empty searches/categories and switch related products.
- [ ] Add the same variant twice, add another variant, then remove items.
- [ ] Open and close the image/bag; check Android back navigation.
- [ ] Load the account, refresh it and return to the shop.
- [ ] Disconnect the network or block an image, then retry.
- [ ] Install both native builds and verify an OTA update after relaunch.

Manual verification is **pending**. Bundle exports validate bundling; installed builds still need device and visual checks.

## Device automation

Install [Maestro](https://docs.maestro.dev/getting-started/installing-maestro) and a preview build using a reachable remote catalog, then run:

```sh
maestro test .maestro/
```

The shopping and account flows are prepared but have **not been run** on a device.
