"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ArrowRight, DollarSign, BarChart, Globe, Shield, CheckCircle, Zap, Bell } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      {/* Sticky Header with Navigation Menu */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">OddsQuest</h1>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/about"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            About OddsQuest
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Learn how we help bettors maximize their profits through arbitrage opportunities.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Real-Time Alerts</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get instant notifications for profitable opportunities.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Automated Analysis</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Let our system do the calculations for you.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC]/50 via-[#FAF9F6] to-[#FAF9F6]" />
          {/* Abstract shapes in the background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 top-1/4 w-72 h-72 bg-[#F5F5DC]/30 rounded-full blur-3xl" />
            <div className="absolute -left-10 top-3/4 w-72 h-72 bg-[#F5F5DC]/30 rounded-full blur-3xl" />
          </div>
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 sm:py-48">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span className="bg-black text-white px-3 py-1 rounded-full">New</span>
                <span className="text-muted-foreground">Multi-bookmaker support added!</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                Turn Sports Betting into <span className="text-black">Guaranteed Profits</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Join smart bettors who use OddsQuest to find arbitrage opportunities with up to 50% ROI. Real-time alerts, zero manual calculations.
              </p>
              <div className="space-x-4 pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-black text-white hover:bg-black/90">
                    Start Free Trial
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">Watch Demo</Button>
              </div>
              <div className="flex items-center space-x-4 pt-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  14-day free trial
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="border-y bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-2">Trusted by Professional Bettors</h2>
              <p className="text-muted-foreground">Join thousands of users making consistent profits</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-muted-foreground font-medium">Bookmakers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-muted-foreground">Daily Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2.5%</div>
                <div className="text-muted-foreground">Avg. ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-muted-foreground">Real-time Updates</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - New! */}
        <section className="bg-[#F5F5DC]/20 py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How OddsQuest Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to start profiting from sports arbitrage
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Bell className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">1. Get Alerts</h3>
                <p className="text-muted-foreground">
                  Receive instant notifications when profitable opportunities are found
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">2. Place Bets</h3>
                <p className="text-muted-foreground">
                  Follow our calculated stake distribution across bookmakers
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <DollarSign className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">3. Profit</h3>
                <p className="text-muted-foreground">
                  Lock in guaranteed returns regardless of the outcome
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Grid */}
        <section className="bg-white py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional tools designed for both beginners and experienced arbitrage bettors
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 space-y-4 hover:shadow-lg transition-all bg-white group">
                <div className="bg-[#F5F5DC] w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold">Real-Time Analysis</h3>
                <p className="text-muted-foreground">
                  Get instant notifications and analysis for new arbitrage opportunities across multiple bookmakers.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Instant odds comparison
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Automated calculations
                  </li>
                </ul>
              </Card>
              {/* Add two more similar feature cards */}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="bg-[#F5F5DC] relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC] via-[#F5F5DC] to-[#FAF9F6]" />
            <div className="absolute inset-0">
              {/* Animated gradient overlay */}
              <div className="absolute -inset-[10px] bg-black/5 blur-3xl animate-pulse" />
              <div className="absolute top-0 left-1/2 w-96 h-96 -translate-x-1/2 bg-white/20 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">

              {/* Heading with gradient text */}
              <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-black via-black to-black/80 bg-clip-text text-transparent">
                Start Profiting Today
              </h2>

              {/* Enhanced value proposition */}
              <div className="space-y-6">
                <p className="text-xl text-black/80 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of users who are already making consistent profits from sports arbitrage.
                  No prior experience needed.
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-black/70" />
                      <span className="text-sm font-medium text-black/80">Real-time Alerts</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-5 h-5 text-black/70" />
                      <span className="text-sm font-medium text-black/80">Risk-Free Returns</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5 text-black/70" />
                      <span className="text-sm font-medium text-black/80">Instant Analysis</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-6 pt-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-black text-white hover:bg-black/90 transition-colors duration-300 min-w-[200px]">
                      Start Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-black/20 text-black hover:bg-black/5 transition-colors duration-300 min-w-[200px]"
                  >
                    Schedule Demo
                    <Globe className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-black/60">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-black/70" />
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-black/70" />
                    14-day free trial
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-black/70" />
                    Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - now with white background */}
      <footer className="border-t bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-black hover:text-black/80">Features</Button></li>
                <li><Button variant="link" className="text-black hover:text-black/80">Pricing</Button></li>
                <li><Button variant="link" className="text-black hover:text-black/80">API</Button></li>
              </ul>
            </div>
            {/* Add more footer columns with the same styling */}
          </div>
          <div className="border-t mt-8 pt-8 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 OddsQuest. All rights reserved.
            </p>
            <div className="space-x-4">
              <Button variant="ghost" size="sm" className="text-black hover:bg-[#F5F5DC]/50">Terms</Button>
              <Button variant="ghost" size="sm" className="text-black hover:bg-[#F5F5DC]/50">Privacy</Button>
              <Button variant="ghost" size="sm" className="text-black hover:bg-[#F5F5DC]/50">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
