import type { CollectionConfig } from 'payload';

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'blogTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'blogImg',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'blogPublishedDate',
      type: 'date',
      required: true,
    },
    {
      name: 'blogResumeText',
      type: 'textarea',
      required: true,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'blogUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'blogPostCategory', // Categoria do artigo
      type: 'text',
      required: true,
    },
    {
      name: 'blogSlug',
      type: 'text',
      required: true,
      unique: true, 
    },
    {
      name: 'blogId', 
      type: 'text',
      required: true,
      unique: true, 
    },
    {
      name: 'blogRichMaterial', 
      type: 'richText',
      required: true,
    },
    {
      name: 'blogLandingPageLink', 
      type: 'text',
    },
    {
      name: 'blogContent', 
      type: 'richText',
      required: true,
    },
  ],
  upload: true, 
};