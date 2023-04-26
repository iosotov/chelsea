// global-setup.js
import { setup as setupDevServer } from 'jest-dev-server'

export default async function globalSetup() {
  globalThis.servers = await setupDevServer({
    command: `npm run start-proxy`,
    port: 3001
  })

  // Your global setup
}
