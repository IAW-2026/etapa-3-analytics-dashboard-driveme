import { auth, clerkClient } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UnauthenticatedCard, AccessDeniedCard } from '@/components/LandingCard'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if ((user.publicMetadata as { role?: string })?.role === 'admin') {
      redirect('/payments')
    }

    const displayName = user.fullName ?? user.emailAddresses[0]?.emailAddress ?? '—'
    const email = user.emailAddresses[0]?.emailAddress

    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <AccessDeniedCard displayName={displayName} email={email} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <UnauthenticatedCard />
    </div>
  )
}
