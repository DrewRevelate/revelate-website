/**
 * Service Card Schema
 * Defines the structure for service offerings in Sanity CMS
 */

export default {
  name: 'serviceCard',
  title: 'Service Card',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'An icon or small image representing this service'
    },
    {
      name: 'iconClass',
      title: 'Icon Class',
      type: 'string',
      description: 'Alternative to an image: provide a Font Awesome class (e.g., "fa-chart-bar")'
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'Brief description for cards and previews (max 200 characters)',
      validation: Rule => Rule.max(200)
    },
    {
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }], // Rich text editor
      description: 'Detailed description of the service'
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Main image for this service'
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text'
            }
          ]
        }
      ],
      description: 'List of key features or aspects of this service'
    },
    {
      name: 'category',
      title: 'Service Category',
      type: 'string',
      options: {
        list: [
          { title: 'Data & Analytics', value: 'data-analytics' },
          { title: 'Revenue Operations', value: 'revenue-operations' },
          { title: 'Business Process Optimization', value: 'business-process' },
          { title: 'Strategic Consulting', value: 'strategic-consulting' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order to display services (lower numbers appear first)',
      initialValue: 99
    },
    {
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'serviceCard' }]
        }
      ],
      validation: Rule => Rule.unique()
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Is this a featured service?',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'coverImage'
    },
    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category ? `Category: ${category}` : '',
        media
      };
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' }
      ]
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' }
      ]
    }
  ]
}
