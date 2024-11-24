import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ArbitrageCard({ game, stakes, onStakeChange }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{game.away_team} @ {game.home_team}</span>
          <span className="text-green-600 text-lg">
            {game.arbitrageOpportunity.profitPercentage}% ROI
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Market Probability</span>
            <span>{(game.arbitrageOpportunity.totalImpliedProbability * 100).toFixed(2)}%</span>
          </div>
          <Progress 
            value={game.arbitrageOpportunity.totalImpliedProbability * 100} 
            className="h-2"
          />
          {/* Add stake input and bet distribution here */}
        </div>
      </CardContent>
    </Card>
  )
}
