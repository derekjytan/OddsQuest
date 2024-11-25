import { Header } from "@/app/components/Header"
import { Sidebar } from "@/app/components/Sidebar"
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SignedIn>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center w-full">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </div>
  )
}