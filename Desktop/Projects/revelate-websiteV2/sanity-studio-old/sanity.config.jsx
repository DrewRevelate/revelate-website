import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'

// Import the schema types
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
  
  // Studio configuration
  studio: {
    components: {
      logo: () => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '18px' }}>
            <span style={{ color: '#4a90e2' }}>Revelate</span>
            <span style={{ color: '#777' }}>Operations</span>
          </div>
        )
      }
    }
  },
  
  // Custom dashboard layout
  document: {
    // Group documents in the studio by type
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(templateItem => templateItem.templateId !== 'siteSettings')
      }
      return prev
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === 'siteSettings') {
        return prev.filter(({ action }) => !['delete', 'duplicate'].includes(action))
      }
      return prev
    }
  },
  
  // Set up a custom structure for the studio
  tools: (prev, { currentUser }) => {
    return [
      ...prev,
      {
        name: 'site-preview',
        title: 'Preview Site',
        icon: () => '🌐',
        component: () => {
          return (
            <div style={{ padding: '1em' }}>
              <h2>Site Preview</h2>
              <p>Preview your website with the current content.</p>
              <div style={{ display: 'flex', gap: '1em', marginTop: '1em' }}>
                <a 
                  href={`https://revelate-operations.vercel.app/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5em 1em',
                    background: '#4a90e2',
                    color: 'white',
                    borderRadius: '4px',
                    textDecoration: 'none'
                  }}
                >
                  Production Site
                </a>
                <a 
                  href={`http://localhost:3000/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5em 1em',
                    background: '#333',
                    color: 'white',
                    borderRadius: '4px',
                    textDecoration: 'none'
                  }}
                >
                  Local Development
                </a>
              </div>
            </div>
          )
        }
      }
    ]
  }
})
