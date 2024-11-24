"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArbitrageCard } from "@/app/components/ArbitrageCard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">24</span>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Latest Opportunities</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        </div>
      </div>
    </div>
  )
}
