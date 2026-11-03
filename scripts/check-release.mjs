import { readFileSync } from 'node:fs';
const config = JSON.parse(readFileSync(new URL('../app.json', import.meta.url))).expo;
const id = config.extra?.eas?.projectId;
const errors = [];
try {
  const url = new URL(process.env.EXPO_PUBLIC_CATALOG_URL);
  if (url.protocol !== 'https:' || /localhost|YOUR-|127\.0\.0\.1/i.test(url.hostname))
    throw new Error();
} catch {
  errors.push('Set EXPO_PUBLIC_CATALOG_URL to the real remote HTTPS catalog URL.');
}
if (!id || !/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(id))
  errors.push('Run eas init to link a real Expo project.');
if (!id || config.updates?.url !== `https://u.expo.dev/${id}`)
  errors.push('Run eas update:configure to set the linked project update URL.');
if (config.runtimeVersion?.policy !== 'fingerprint')
  errors.push('Set runtimeVersion.policy to fingerprint after configuring updates.');
if (errors.length) {
  console.error(`Release setup incomplete:\n${errors.map((e) => `- ${e}`).join('\n')}`);
  process.exit(1);
}
console.log('Release configuration is ready. Verify the remote catalog/images, then build.');
