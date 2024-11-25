import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, TrendingUpIcon, AlertCircle, DollarSign, PercentIcon, ScaleIcon, Share2, BookmarkPlus, Bell, Copy, ExternalLink } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { toast } from "sonner"

export function ArbitrageCard({ game, stakes, onStakeChange }) {
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getArbitrageStatus = (percentage) => {
    const profit = Number(percentage);
    if (profit >= 5) return { label: "Excellent", color: "bg-green-500" };
    if (profit >= 2) return { label: "Good", color: "bg-emerald-500" };
    if (profit > 0) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "No Arbitrage", color: "bg-red-500" };
  };

  const status = getArbitrageStatus(game.arbitrageOpportunity.profitPercentage);

  const handleCopyBetDetails = () => {
    const betDetails = `
      Arbitrage Opportunity:
      ${game.home_team} vs ${game.away_team}
      ROI: ${game.arbitrageOpportunity.profitPercentage}%
      Best Odds:
      ${Object.entries(game.arbitrageOpportunity.bestOdds).map(([team, odds]) => 
        `${team}: ${odds} (${game.arbitrageOpportunity.bestOddsSource[team]})`
      ).join('\n')}
    `.trim()
    navigator.clipboard.writeText(betDetails)
    toast.success("Bet details copied to clipboard")
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        {/* Header with Time and Sport */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {formatDate(game.commence_time)}
            </Badge>
            <Badge variant="secondary">{game.sport_title}</Badge>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>

        {/* Add action buttons to header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopyBetDetails}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy bet details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsNotifyEnabled(!isNotifyEnabled)}
                  >
                    <Bell className={`w-4 h-4 ${isNotifyEnabled ? 'text-primary' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isNotifyEnabled ? 'Disable notifications' : 'Get notified of odds changes'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Teams and ROI */}
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <span className="text-lg font-semibold">{game.home_team}</span>
            <span className="text-sm text-muted-foreground">vs</span>
            <span className="text-lg font-semibold">{game.away_team}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${Number(game.arbitrageOpportunity.profitPercentage) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {game.arbitrageOpportunity.profitPercentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">Expected ROI</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return on Investment for this arbitrage opportunity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="odds" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="odds">Odds & Analysis</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="odds" className="space-y-4">
            {/* Market Efficiency Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <ScaleIcon className="w-4 h-4" />
                  Market Efficiency
                </span>
                <span className="font-medium">
                  {(game.arbitrageOpportunity.totalImpliedProbability * 100).toFixed(2)}%
                </span>
              </div>
              <Progress 
                value={game.arbitrageOpportunity.totalImpliedProbability * 100} 
                className="h-2"
              />
            </div>

            {/* Best Odds Section */}
            <div className="space-y-2 bg-muted p-3 rounded-lg">
              <div className="text-sm font-medium flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4" />
                Best Available Odds:
              </div>
              {Object.entries(game.arbitrageOpportunity.bestOdds).map(([team, odds]) => (
                <div key={team} className="flex justify-between items-center text-sm bg-background p-2 rounded">
                  <span>{team}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {odds}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      via {game.arbitrageOpportunity.bestOddsSource[team]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Quick Actions */}
            <div className="flex gap-2 mb-4">
              <Button variant="outline" className="flex-1" onClick={() => window.open(game.arbitrageOpportunity.bestOddsUrls?.home_team, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Bet Home
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => window.open(game.arbitrageOpportunity.bestOddsUrls?.away_team, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Bet Away
              </Button>
            </div>

            {/* Add Historical Odds Chart placeholder */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">Odds History (24h)</div>
              <div className="h-[100px] flex items-center justify-center text-muted-foreground">
                {/* Add your chart component here */}
                Chart placeholder
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            {/* Stake Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Investment:
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter stake amount"
                  value={stakes?.totalStake || ''}
                  onChange={(e) => onStakeChange(e.target.value)}
                />
                <Button variant="outline" onClick={() => onStakeChange('100')}>
                  $100
                </Button>
              </div>
            </div>

            {/* Bet Distribution */}
            {stakes?.bets && Object.keys(stakes.bets).length > 0 && (
              <div className="space-y-2 bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium flex items-center gap-2">
                  <PercentIcon className="w-4 h-4" />
                  Recommended Bet Distribution:
                </div>
                {Object.entries(stakes.bets).map(([team, amount]) => (
                  <div key={team} className="flex justify-between items-center bg-background p-2 rounded">
                    <span className="text-sm">{team}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${amount}</span>
                      <span className="text-xs text-muted-foreground">
                        ({game.arbitrageOpportunity.betPercentage[team]}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Profit Breakdown */}
            {stakes?.totalStake && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Profit Breakdown</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Investment:</span>
                    <span className="font-medium">${stakes.totalStake}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expected Return:</span>
                    <span className="font-medium text-green-600">
                      ${(stakes.totalStake * (1 + Number(game.arbitrageOpportunity.profitPercentage) / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Profit:</span>
                    <span className="font-medium text-green-600">
                      ${(stakes.totalStake * (Number(game.arbitrageOpportunity.profitPercentage) / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
