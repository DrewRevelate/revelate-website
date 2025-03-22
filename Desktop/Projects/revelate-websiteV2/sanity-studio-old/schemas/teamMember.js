/**
 * Team Member Schema
 * Defines the structure for team members in Sanity CMS
 */

export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }], // Rich text editor
      validation: Rule => Rule.required()
    },
    {
      name: 'shortBio',
      title: 'Short Biography',
      type: 'text',
      description: 'Brief bio for cards and previews (max 200 characters)',
      validation: Rule => Rule.max(200)
    },
    {
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string'
            },
            {
              name: 'organization',
              title: 'Organization',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text'
            }
          ]
        }
      ]
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url'
        },
        {
          name: 'github',
          title: 'GitHub',
          type: 'url'
        },
        {
          name: 'website',
          title: 'Personal Website',
          type: 'url'
        }
      ]
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order to display team members (lower numbers appear first)',
      initialValue: 99,
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'isFounder',
      title: 'Is Founder',
      type: 'boolean',
      description: 'Is this person a founder of the company?',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      media: 'photo'
    },
    prepare({ title, role, media }) {
      return {
        title,
        subtitle: role,
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
      title: 'Name',
      name: 'nameAsc',
      by: [
        { field: 'name', direction: 'asc' }
      ]
    }
  ]
}
