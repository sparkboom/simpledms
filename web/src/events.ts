import { shutdown } from './domain/app.ts';

// Types
// type Handler = (signal: string) => (...args: any[]) => never; // TODO: improve this typing

// Lifecycle Event Listeners & Process Signals
window.addEventListener('load', () => {
  console.log('App: Loaded');
});
window.addEventListener('unload', async () => {
  console.log('App: Unloading');
  await shutdown();
});

// Seems this causes build issues even if run in unstable mode
//
// const closeHandler: Handler = signal => err => {
//   console.log(`Events: Signal received: ${signal}`, err);
//   Deno.exit();
// };
// const gracefulShutdownHandler: Handler = signal => err => {
//   console.log(`Events: Signal received: ${signal}`, err);
//   shutdown()
//     .then(() => Deno.exit());
// };

// Deno.addSignalListener('SIGINT', closeHandler('SIGINT'));
// Deno.addSignalListener('SIGKILL', closeHandler('SIGKILL'));
// Deno.addSignalListener('SIGTERM', gracefulShutdownHandler('SIGTERM'));
