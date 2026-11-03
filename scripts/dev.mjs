import { spawn } from 'node:child_process';
import { networkInterfaces } from 'node:os';
const lan =
  Object.values(networkInterfaces())
    .flat()
    .find((i) => i && i.family === 'IPv4' && !i.internal)?.address || 'localhost';
const url =
  process.env.EXPO_PUBLIC_CATALOG_URL ||
  `http://${lan}:${process.env.API_PORT || 8787}/catalog.json`;
console.log(`Using catalog: ${url}. Your phone must be on the same Wi-Fi network.`);
const children = [];
const stop = () => children.forEach((child) => child.kill('SIGTERM'));
children.push(spawn(process.execPath, ['scripts/api-server.mjs'], { stdio: 'inherit' }));
children.push(
  spawn(process.execPath, ['node_modules/expo/bin/cli', 'start', ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, EXPO_PUBLIC_CATALOG_URL: url },
  }),
);
for (const child of children)
  child.on('exit', (code) => {
    stop();
    process.exitCode = code || 0;
  });
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
