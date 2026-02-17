import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function EpisodeReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Episode Review</h2>
        <p className="text-muted-foreground">
          Inspect flagged episodes, add notes, and export for LLM analysis
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Backend episode logging and flagging is not yet implemented. This feature will allow you to review
          episodes that exceeded loss thresholds, view detailed context (candles, actions, PnL), add notes,
          and export JSON for LLM-assisted analysis.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Episodes</CardTitle>
          <CardDescription>
            Episodes automatically flagged based on loss thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No episodes available</p>
        </CardContent>
      </Card>
    </div>
  );
}
