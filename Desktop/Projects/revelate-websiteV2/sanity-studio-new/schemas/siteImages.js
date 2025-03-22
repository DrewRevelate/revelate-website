// Site Images Schema
export default {
  name: 'siteImages',
  title: 'Website Images',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Descriptive name for this image',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Hero Images', value: 'hero' },
          { title: 'About Page', value: 'about' },
          { title: 'Services Page', value: 'services' },
          { title: 'Approach Page', value: 'approach' },
          { title: 'Contact Page', value: 'contact' },
          { title: 'Case Studies', value: 'case-studies' },
          { title: 'Logos', value: 'logos' },
          { title: 'Icons', value: 'icons' },
          { title: 'Background Patterns', value: 'patterns' },
          { title: 'Other', value: 'other' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'identifier',
      title: 'Identifier',
      type: 'string',
      description: 'Unique identifier to reference this image in code (e.g., "home-hero")',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Describe the image for SEO and accessibility (screen readers)',
      validation: Rule => Rule.required()
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption to display with the image'
    },
    {
      name: 'darkModeVariant',
      title: 'Dark Mode Variant',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Alternative version of this image for dark mode (optional)'
    }
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
      identifier: 'identifier',
      media: 'image'
    },
    prepare({ title, category, identifier, media }) {
      return {
        title,
        subtitle: `${category} (${identifier})`,
        media
      };
    }
  }
}
