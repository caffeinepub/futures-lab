import { useGetCallerUserProfile } from '../../lib/queries';
import { AsyncState } from '../../components/system/AsyncState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

export function TradingPortfolioPage() {
  const { data: profile, isLoading, isError, error, refetch } = useGetCallerUserProfile();

  // Mock portfolio data - in production this would come from backend
  const mockPortfolio = {
    totalBalance: 10000.00,
    availableBalance: 8500.00,
    totalPnL: 1250.50,
    pnlPercentage: 14.3,
    positions: [
      { symbol: 'BTCUSDT', size: 0.5, entryPrice: 45000, currentPrice: 47500, pnl: 1250, pnlPercent: 5.56 },
      { symbol: 'ETHUSDT', size: 2.0, entryPrice: 2800, currentPrice: 2750, pnl: -100, pnlPercent: -1.79 },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Portfolio & Positions</h2>
        <p className="text-muted-foreground mt-1">
          View your current balances and open positions
        </p>
      </div>

      <AsyncState
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        onRetry={refetch}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockPortfolio.totalBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">USDT equivalent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockPortfolio.availableBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">For new orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              {mockPortfolio.totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${mockPortfolio.totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${mockPortfolio.totalPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockPortfolio.pnlPercentage >= 0 ? '+' : ''}{mockPortfolio.pnlPercentage.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPortfolio.positions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active trades</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
            <CardDescription>Your current trading positions</CardDescription>
          </CardHeader>
          <CardContent>
            {mockPortfolio.positions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No open positions
              </div>
            ) : (
              <div className="space-y-4">
                {mockPortfolio.positions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{position.symbol}</h3>
                        <Badge variant="outline">{position.size > 0 ? 'Long' : 'Short'}</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">{Math.abs(position.size)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Entry</p>
                          <p className="font-medium">${position.entryPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">${position.currentPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-lg font-bold ${position.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </div>
                      <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AsyncState>
    </div>
  );
}
