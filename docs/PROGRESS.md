# Implementation log

The original brief is preserved in [ASSIGNMENT.md](ASSIGNMENT.md).

## Step 1 — product screen

- Started from Expo's blank TypeScript starter. No application existed initially.
- Recreated the reference's restrained typography, spacing, hero image and related products.
- Reused the supplied reference artwork through a reusable image crop component. Small reference thumbnails become pixelated when enlarged; production should supply high-resolution individual product images.
- Added working category filters, search, size/color selection, image enlargement and a shopping bag. The blank reference button is labelled “ADD TO BAG” for clarity and accessibility.
- Account navigation is a placeholder until step 4. State is local until step 2, and fixtures are replaced by HTTP loading in step 3.
- Each step starts from the preceding branch, preserving the full incremental history.

## Step 2 — shared state

- Chose Zustand because the assignment has a small shared state surface. Product selection, navigation and bag items share a typed store without a large Redux setup.
- Adding the same product/size/color increments quantity. Different variants remain separate. The store rejects invalid variants.
- Kept ephemeral search, zoom and form inputs local. Bag state survives screen changes, but deliberately resets on application restart.
- Added safe-area handling and a web target for accessible browser-based verification.
