# Expo / React Native Developer Test

Create an Expo / React Native application, based on provided layout.

All elements of the shared layout should be functional, it's up to you how they will work at the end.

### Considerations

- The documentation starting on the README.md file need to be clear
- We want to see not only the solution but also how you think and your working process, so please keep all your commits accessible and use proper naming standard for them
- All steps are required so do not skip any. If you don't know, or don't feel comfortable with the required technology, just try your best and commit what you can
- Each step must be done in a separate branch

### Required Technology
- Git
- TypeScript
- Expo / React Native

### Layout

You can find layout of our application in `/layout` catalog


### STEP 1 

Create an Expo / React Native application based on `/layout`

We are sharing only one screen, it's up to you how many screens you will create

### STEP 2

Application must be using a state management system.

Choose a state management library of your liking (redux, redux-saga) and use it in application

### STEP 3

All data must come dynamically from API

Create .json files, structure is up to you. Put some random data. Put files in a remote location (AWS bucket / GCP bucket) and make calls from the app to them.

Required data:
main product data (image URL, title, price, available sizes, colors description)
see more products (products image URLs)

### STEP 4

Create my account screen

We don't need an identity system, log-in, registration screens, let's assume a user is already logged in.
Use [Rick and Morty API](https://rickandmortyapi.com/documentation/#get-a-single-character) to get user data

### STEP 5

Test all the things. Propose how to apply unit and functional tests. Create test scenarios.

### STEP 6 (BONUS)

Use [EAS Build](https://docs.expo.dev/build/introduction/) to build your application for iOS and Android, and publish an [EAS Update](https://docs.expo.dev/eas-update/introduction/) (OTA) to it

### Deployment

We would like to see not only the application code but also iOS and Android builds

### Wrapping up

In the README file, we should be able to find all the information necessary to run the project, the different challenges, and the test. Documentation is highly important for the resolution of this test.


### Delivery

If your repository is private, please share it with @daniel-rosiak & @white-space-dev
