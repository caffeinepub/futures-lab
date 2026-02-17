import { useState } from 'react';
import { useGetCallerUserProfile } from '../../lib/queries';
import { AsyncState } from '../../components/system/AsyncState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { TradingMode } from '../../backend';

export function TradingOrdersPage() {
  const { data: profile, isLoading, isError, error, refetch } = useGetCallerUserProfile();
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState('');

  const mode = profile?.tradingStatus?.mode || TradingMode.paperTrading;
  const isLiveMode = mode === TradingMode.liveTrading;

  // Mock open orders
  const mockOrders = [
    { id: '1', symbol: 'BTCUSDT', side: 'buy', type: 'limit', quantity: 0.1, price: 45000, status: 'open' },
    { id: '2', symbol: 'ETHUSDT', side: 'sell', type: 'limit', quantity: 1.0, price: 2900, status: 'open' },
  ];

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (orderType === 'limit' && (!price || parseFloat(price) <= 0)) {
      toast.error('Please enter a valid price for limit order');
      return;
    }

    if (isLiveMode) {
      toast.warning('Live trading order placement - This would place a real order!');
    } else {
      toast.success(`${mode === TradingMode.shadowTrading ? 'Shadow' : 'Paper'} order placed successfully`);
    }

    // Reset form
    setQuantity('');
    setPrice('');
  };

  const handleCancelOrder = (orderId: string) => {
    toast.success('Order cancelled');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground mt-1">
          Place new orders and manage existing ones
        </p>
      </div>

      <AsyncState
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        onRetry={refetch}
      >
        <Tabs defaultValue="place" className="space-y-4">
          <TabsList>
            <TabsTrigger value="place">Place Order</TabsTrigger>
            <TabsTrigger value="open">Open Orders ({mockOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="place" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Order</CardTitle>
                <CardDescription>
                  {isLiveMode && (
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      ⚠️ Live Mode: Real orders will be placed
                    </span>
                  )}
                  {!isLiveMode && (
                    <span>
                      {mode === TradingMode.shadowTrading ? 'Shadow mode: Live data, simulated execution' : 'Paper mode: Fully simulated'}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="symbol">Symbol</Label>
                      <Select value={symbol} onValueChange={setSymbol}>
                        <SelectTrigger id="symbol">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
                          <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
                          <SelectItem value="BNBUSDT">BNBUSDT</SelectItem>
                          <SelectItem value="SOLUSDT">SOLUSDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="side">Side</Label>
                      <Select value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
                        <SelectTrigger id="side">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderType">Order Type</Label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger id="orderType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="limit">Limit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.001"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  {orderType === 'limit' && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className={`w-full ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {side === 'buy' ? 'Buy' : 'Sell'} {symbol}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="open" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Open Orders</CardTitle>
                <CardDescription>Manage your pending orders</CardDescription>
              </CardHeader>
              <CardContent>
                {mockOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No open orders
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{order.symbol}</h3>
                            <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                              {order.side.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{order.type}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Quantity</p>
                              <p className="font-medium">{order.quantity}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Price</p>
                              <p className="font-medium">${order.price.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <p className="font-medium capitalize">{order.status}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleCancelOrder(order.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AsyncState>
    </div>
  );
}
