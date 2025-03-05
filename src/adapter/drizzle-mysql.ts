import { MySqlDatabase } from 'drizzle-orm/mysql-core'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { Payload } from 'payload'
import { DatabaseAdapter, EntityPagination, FindArgs, PaginatedDocs } from 'payload/database'
import { eq, and, or, SQL, inArray } from 'drizzle-orm'
import { parseError } from 'payload/utilities'

export class DrizzleMySQLAdapter implements DatabaseAdapter {
  private db: MySqlDatabase
  private connection: mysql.Connection
  public transactionDepth = 0

  constructor(
    private payload: Payload,
    private config: {
      connection: mysql.ConnectionOptions
      schema: Record<string, any>
    }
  ) {}

  async init(): Promise<void> {
    await this.connect()
    await this.migrate()
  }

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(this.config.connection)
      this.db = drizzle(this.connection, { schema: this.config.schema })
      this.payload.logger.info('✅ Connected to MySQL via Drizzle')
    } catch (err) {
      this.payload.logger.error('❌ Drizzle connection error:', parseError(err))
      process.exit(1)
    }
  }

  async destroy(): Promise<void> {
    await this.connection.end()
  }

  async migrate(): Promise<void> {
    // Implementar sistema de migrações com drizzle-kit
    // Ver exemplo abaixo para configuração
  }

  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => {
      try {
        this.transactionDepth++
        const result = await handler()
        this.transactionDepth--
        return result
      } catch (err) {
        tx.rollback()
        throw err
      }
    })
  }

  async create<T extends Record<string, unknown>>(table: string, data: T): Promise<number> {
    const result = await this.db.insert(this.config.schema[table]).values(data)
    return Number(result[0].insertId)
  }

  async update<T extends Record<string, unknown>>(
    table: string,
    where: Record<string, unknown>,
    data: T
  ): Promise<void> {
    await this.db
      .update(this.config.schema[table])
      .set(data)
      .where(this.buildWhereClause(table, where))
  }

  async delete(table: string, where: Record<string, unknown>): Promise<void> {
    await this.db
      .delete(this.config.schema[table])
      .where(this.buildWhereClause(table, where))
  }

  async find<T extends Record<string, unknown>>(
    args: FindArgs
  ): Promise<PaginatedDocs<T>> {
    const { where, limit, page, sort } = args
    const table = this.config.schema[args.collection]

    const query = this.db
      .select()
      .from(table)
      .where(this.buildWhereClause(args.collection, where))
      .limit(limit || 10)
      .offset((page || 0) * (limit || 10))

    if (sort) {
      query.orderBy(sort.direction === 'asc' ? 
        table[sort.field].asc() : 
        table[sort.field].desc())
    }

    const docs = await query
    const total = await this.db
      .select({ count: table.id })
      .from(table)
      .where(this.buildWhereClause(args.collection, where))

    return {
      docs: docs as T[],
      totalDocs: Number(total[0]?.count) || 0,
      totalPages: Math.ceil((Number(total[0]?.count) || 0) / (limit || 10)),
      page: page || 1,
    }
  }

  private buildWhereClause(table: string, where: Record<string, unknown>): SQL {
    const tableSchema = this.config.schema[table]
    const conditions = Object.entries(where).map(([field, value]) => {
      if (typeof value === 'object' && value !== null) {
        const [operator, val] = Object.entries(value)[0]
        switch (operator) {
          case 'equals':
            return eq(tableSchema[field], val)
          case 'in':
            return inArray(tableSchema[field], val as any[])
          case 'contains':
            return sql`${tableSchema[field]} LIKE ${`%${val}%`}`
          // Adicionar mais operadores conforme necessário
          default:
            return eq(tableSchema[field], value)
        }
      }
      return eq(tableSchema[field], value)
    })

    return conditions.length > 1 ? and(...conditions) : conditions[0]
  }

  // Implementar outros métodos necessários (findByID, count, etc)
}