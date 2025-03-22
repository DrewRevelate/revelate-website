import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'o4fxge9p',
    dataset: 'production'
  },
  // Add this line to avoid prompting for hostname on next deploy
  studioHost: 'revelateoperations'
})
