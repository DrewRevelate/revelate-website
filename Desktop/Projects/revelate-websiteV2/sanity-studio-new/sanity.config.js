import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'revelate-operations',
  title: 'Revelate Operations CMS',
  
  projectId: 'o4fxge9p',
  dataset: 'production',
  
  plugins: [
    deskTool(),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  // Set a different port to avoid conflicts
  server: {
    port: 3334
  }
})
