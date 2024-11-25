import { Header } from "@/app/components/Header"
import { Sidebar } from "@/app/components/Sidebar"
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 bg-white z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <Header />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
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