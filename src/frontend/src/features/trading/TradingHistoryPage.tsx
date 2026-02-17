import { useState } from 'react';
import { useGetCallerUserProfile } from '../../lib/queries';
import { AsyncState } from '../../components/system/AsyncState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export function TradingHistoryPage() {
  const { data: profile, isLoading, isError, error, refetch } = useGetCallerUserProfile();
  const [symbolFilter, setSymbolFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock trade history
  const mockTrades = [
    {
      id: '1',
      timestamp: new Date('2026-02-15T10:30:00'),
      symbol: 'BTCUSDT',
      side: 'buy',
      quantity: 0.5,
      price: 45000,
      total: 22500,
      pnl: 1250,
      status: 'filled',
    },
    {
      id: '2',
      timestamp: new Date('2026-02-14T15:45:00'),
      symbol: 'ETHUSDT',
      side: 'sell',
      quantity: 2.0,
      price: 2800,
      total: 5600,
      pnl: -100,
      status: 'filled',
    },
    {
      id: '3',
      timestamp: new Date('2026-02-13T09:15:00'),
      symbol: 'BTCUSDT',
      side: 'sell',
      quantity: 0.3,
      price: 46000,
      total: 13800,
      pnl: 450,
      status: 'filled',
    },
  ];

  const filteredTrades = mockTrades.filter((trade) => {
    if (symbolFilter !== 'all' && trade.symbol !== symbolFilter) return false;
    return true;
  });

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Trade History</h2>
        <p className="text-muted-foreground mt-1">
          View your historical trades and performance
        </p>
      </div>

      <AsyncState
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        onRetry={refetch}
      >
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter your trade history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol-filter">Symbol</Label>
                <Select value={symbolFilter} onValueChange={setSymbolFilter}>
                  <SelectTrigger id="symbol-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Symbols</SelectItem>
                    <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
                    <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
                    <SelectItem value="BNBUSDT">BNBUSDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-range">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger id="time-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Total P&L</Label>
                <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade History</CardTitle>
            <CardDescription>
              {filteredTrades.length} trade{filteredTrades.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTrades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No trades found for the selected filters
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{trade.symbol}</h3>
                        <Badge variant={trade.side === 'buy' ? 'default' : 'destructive'}>
                          {trade.side.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{trade.status}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Time</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {trade.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{trade.quantity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-medium">${trade.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-medium">${trade.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-muted-foreground mb-1">P&L</p>
                      <div className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
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
