import { NextResponse } from 'next/server'
import { Client } from 'pg'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Forbidden', { status: 403 })
  }

  // Bypass self-signed certificate verification
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL
  if (!connectionString) {
    return NextResponse.json({ error: 'Missing database connection string' }, { status: 500 })
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()

    // Read migration file
    const filePath = path.join(process.cwd(), 'supabase', 'migrations', '20260719000000_init.sql')
    const sql = await fs.readFile(filePath, 'utf8')

    // Execute SQL script
    await client.query(sql)

    return NextResponse.json({ success: true, message: 'Database tables and schemas initialized successfully!' })
  } catch (err: any) {
    console.error('Database initialization error:', err)
    return NextResponse.json({ error: err.message || 'Database initialization failed' }, { status: 500 })
  } finally {
    await client.end()
  }
}
