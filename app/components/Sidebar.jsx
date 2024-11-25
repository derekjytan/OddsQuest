"use client";
import { HomeIcon, LineChart, DollarSign, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sports } from "@/app/constants/sports";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-64 pb-12 min-h-screen border-r">
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <h2 className="mb-2 px-2 text-sm font-semibold">OddsQuest</h2>
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start text-sm"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>

            <div>
              <Button
                variant="ghost"
                className="w-full justify-between text-sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex items-center">
                  <LineChart className="mr-2 h-4 w-4" />
                  Sports
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {sports.map((sport) => (
                    <Link key={sport.id} href={`/dashboard/sports/${sport.id}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                      >
                        {sport.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/dashboard/my-bets">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <DollarSign className="mr-2 h-4 w-4" />
                My Bets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
