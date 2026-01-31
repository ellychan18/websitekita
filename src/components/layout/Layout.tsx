import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />
      <main className="pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
        <Outlet />
      </main>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
           <BottomNav />
        </div>
      </div>
    </div>
  )
}