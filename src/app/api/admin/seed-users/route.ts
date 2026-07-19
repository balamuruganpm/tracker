import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Forbidden', { status: 403 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Missing Supabase service configuration' }, { status: 500 })
  }

  // Create admin client using service role key
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // 1. Fetch existing users
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError

    // 2. Delete existing users to ensure clean slate
    for (const u of users) {
      await supabaseAdmin.auth.admin.deleteUser(u.id)
    }

    // 3. Create User 1: bala
    const { data: user1, error: u1Error } = await supabaseAdmin.auth.admin.createUser({
      email: 'bala@project730.local',
      password: 'sudha123@',
      email_confirm: true,
      user_metadata: { name: 'Balamurugan' }
    })
    if (u1Error) throw u1Error

    // 4. Create User 2: sudha
    const { data: user2, error: u2Error } = await supabaseAdmin.auth.admin.createUser({
      email: 'sudha@project730.local',
      password: 'bala123@',
      email_confirm: true,
      user_metadata: { name: 'Sudha' }
    })
    if (u2Error) throw u2Error

    return NextResponse.json({
      success: true,
      usersCreated: ['bala@project730.local', 'sudha@project730.local']
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Seeding users failed' }, { status: 500 })
  }
}
