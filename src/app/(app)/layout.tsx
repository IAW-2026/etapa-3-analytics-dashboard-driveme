import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
        className="p-4 md:py-6 md:pr-6 md:pl-[264px]"
        style={{ flex: 1, minHeight: '100vh', overflowY: 'auto' }}
      >
        {children}
      </main>
    </div>
  )
}
