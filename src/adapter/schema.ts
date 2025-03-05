import { mysqlTable, serial, text, varchar, json, int, timestamp } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  verified: int('verified').default(0),
  roles: json('roles'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

export const media = mysqlTable('media', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }),
  filesize: int('filesize'),
  sizes: json('sizes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

export const schema = {
  users,
  media,
}