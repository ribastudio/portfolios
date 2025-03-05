import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from '@payloadcms/translations/languages/en'

import { Users } from './src/app/collections/Users'
import { Media } from './src/app/collections/Media'
import { Articles } from './src/app/collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log(path.resolve(dirname))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Articles],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [],
  i18n: {
    fallbackLanguage: 'pt',
    supportedLanguages: { en },
  },
  localization: {
    locales: ['en', 'pt'],
    defaultLocale: 'pt'
  }
})