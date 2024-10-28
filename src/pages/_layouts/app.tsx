import { Outlet } from 'react-router-dom'

import { Header } from '../../components/header'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <main className="mx-auto w-[1030px]">
        <Outlet />
      </main>
    </div>
  )
}
