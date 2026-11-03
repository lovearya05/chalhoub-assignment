# Test strategy and scenarios

Run `npm run typecheck`, `npm test -- --runInBand --coverage`, `npm run format:check` and `npx expo export --platform web`. CI runs the same checks on GitHub pushes and pull requests after the repository is connected.

## Automated coverage

Jest with the Expo preset runs domain tests and React Native Testing Library integration tests. HTTP responses are mocked in tests; no third-party outage or product image download is needed to run the suite. Production code still makes real HTTP requests.

| Area             | Scenarios                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catalog contract | Relative URLs, all five products, empty/malformed data, duplicate IDs, invalid price/size/category/color, unsafe image URLs, invalid/out-of-bounds crops |
| Requests         | Successful JSON, HTTP 503, malformed JSON, offline failure, abort after 12 seconds                                                                       |
| Shopping state   | Invalid variants rejected; identical variants merged; size/color variants separate; total calculation; removal; bag preserved during navigation          |
| Product screen   | Loading real app with mocked network; required selection feedback; add/remove/quantity; search; empty category; related product selection; image modal   |
| Account          | Remote data rendering; origin and avatar mapping; refresh; back navigation; failed request and retry; malformed response rejection                       |
| Failure recovery | Catalog and account retries restore usable screens                                                                                                       |

The suite checks observable behavior without snapshots of implementation details. Native safe-area metrics are mocked for stable layout-independent assertions.

## Functional device tests

`.maestro/shopping.yaml` and `.maestro/account.yaml` are proposed runnable device flows for an installed standalone build with application ID `com.lovepreet.tigerstore`. Install [Maestro](https://docs.maestro.dev/getting-started/installing-maestro), install the matching preview build, then run `maestro test .maestro/`. Use a reachable remote HTTPS catalog for these tests. These flows have **not** been run here because no signed native build or simulator session is available.

## Manual acceptance checklist

| Scenario                                    | Expected result                                                                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Compare at 375px width with layout/task.png | Similar hierarchy, red hero, four swatches and related thumbnails. Account/bag links and labelled action are intentional additions. |
| Narrow phone, tablet, larger font settings  | Scrollable page; content stays readable, centered and within viewport.                                                              |
| VoiceOver / TalkBack / keyboard             | Buttons and inputs named; selected options announced; feedback announced; modal can be closed.                                      |
| Select size only / color only; add          | Prompt asks for both selections; bag unchanged.                                                                                     |
| Same variant twice / different variant      | Quantity 2 on first row; second variant in separate row; correct total.                                                             |
| Search mixed case / whitespace / no results | Case-insensitive, trimmed results; useful empty state.                                                                              |
| Switch each category                        | Correct catalog filter; empty categories explicitly handled. Seed catalog only contains MEN.                                        |
| Open related product                        | Product updates and previous size/color selection clears.                                                                           |
| Open/close enlarged image and bag           | Back/close dismisses modal; page remains usable.                                                                                    |
| Disable network before catalog/account load | Error shown; restore network and retry successfully.                                                                                |
| Block product image URL                     | Image placeholder appears with retry action.                                                                                        |
| Slow API past 12 seconds                    | Timeout message and retry action.                                                                                                   |
| Leave account while request pending         | No stale profile update or navigation change.                                                                                       |
| Android back on account / modal             | Return to shop / close modal.                                                                                                       |
| Restart app                                 | Bag resets; persistence is deliberately outside scope.                                                                              |
| Install Android APK / iOS simulator build   | Cold launch, HTTPS catalog, images, account and bag work.                                                                           |
| EAS Update on preview channel               | Compatible installed build downloads update and applies it after relaunch.                                                          |

## Verification limits

The automated suite and exports do not prove native visual fidelity, accessibility focus trapping or touch behavior. The browser automation host was unavailable during implementation, so no browser screenshot comparison was completed. Manual device and visual checks above remain to be performed. Build/OTA publication results must be recorded after Expo setup; configuration alone is not a successful build.
