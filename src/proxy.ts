import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export default function proxy(request: NextRequest) {
  const expected = (process.env.CONTROL_PLANE_PASSWORD ?? '').trim()

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorized()
  }

  const base64 = authHeader.slice(6).trim()
  let decoded: string
  try {
    decoded = atob(base64)
  } catch {
    return unauthorized()
  }

  const colonIndex = decoded.indexOf(':')
  const password = colonIndex >= 0 ? decoded.slice(colonIndex + 1) : decoded

  if (!expected || password !== expected) {
    return unauthorized()
  }

  return NextResponse.next()
}

function unauthorized() {
  // Use native Response so the WWW-Authenticate header reaches the browser unchanged
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="DriveMe Analytics"',
      'Content-Type': 'text/plain',
    },
  })
}
