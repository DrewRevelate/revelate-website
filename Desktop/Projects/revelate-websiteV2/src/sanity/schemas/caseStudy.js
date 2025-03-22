/**
 * Case Study Schema
 * Defines the structure for case studies in Sanity CMS
 */

module.exports = {
  name: 'caseStudy',
  title: 'Case Study',
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
      name: 'client',
      title: 'Client',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'industry',
      title: 'Industry',
      type: 'string'
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true // Enables the hotspot functionality for responsive cropping
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short summary of the case study (displayed in cards)',
      validation: Rule => Rule.max(250)
    },
    {
      name: 'challenge',
      title: 'Challenge',
      type: 'text',
      description: 'The problem or challenge the client faced'
    },
    {
      name: 'solution',
      title: 'Solution',
      type: 'array',
      of: [{ type: 'block' }], // Rich text editor
      description: 'The solution provided by Revelate Operations'
    },
    {
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [{ type: 'block' }], // Rich text editor
      description: 'The outcomes and results of the implementation'
    },
    {
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string'
            },
            {
              name: 'value',
              title: 'Value',
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
      description: 'Key performance metrics and statistics'
    },
    {
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text'
        },
        {
          name: 'author',
          title: 'Author',
          type: 'string'
        },
        {
          name: 'position',
          title: 'Position',
          type: 'string'
        }
      ]
    },
    {
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            },
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      name: 'services',
      title: 'Services Applied',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Data & Analytics', value: 'data-analytics' },
          { title: 'Revenue Operations', value: 'revenue-operations' },
          { title: 'CRM Integration', value: 'crm-integration' },
          { title: 'Business Intelligence', value: 'business-intelligence' },
          { title: 'Sales Process Optimization', value: 'sales-process' },
          { title: 'Customer Engagement', value: 'customer-engagement' },
          { title: 'Market Analysis', value: 'market-analysis' },
          { title: 'Training & Enablement', value: 'training' }
        ]
      }
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Should this case study be featured on the homepage?',
      initialValue: false
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'coverImage'
    },
    prepare({ title, client, media }) {
      return {
        title,
        subtitle: `Client: ${client || 'Unknown'}`,
        media
      };
    }
  }
};
