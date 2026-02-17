import { useState } from 'react';
import { useGetAllDatasets, useUploadDataset } from '../../lib/queries';
import { AsyncState } from '../../components/system/AsyncState';
import { parseDatasetFile } from './datasetParsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function DatasetsPage() {
  const { data: datasets = [], isLoading, isError, error, refetch } = useGetAllDatasets();
  const uploadDataset = useUploadDataset();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a dataset name');
      return;
    }
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    
    try {
      const candles = await parseDatasetFile(file);
      const datasetId = `dataset-${Date.now()}`;
      
      await uploadDataset.mutateAsync({
        datasetId,
        candles,
        name: name.trim(),
        description: description.trim(),
      });
      
      setIsDialogOpen(false);
      setName('');
      setDescription('');
      setFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload dataset');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Datasets</h2>
          <p className="text-muted-foreground mt-1">
            Manage your historical market data
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Dataset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Dataset</DialogTitle>
              <DialogDescription>
                Upload CSV or JSON file with OHLCV candle data
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Dataset Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., BTC-USD 1h 2024"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  CSV or JSON with columns: timestamp, open, high, low, close, volume
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AsyncState
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        isEmpty={datasets.length === 0}
        emptyMessage="No datasets uploaded yet. Upload your first dataset to get started."
        onRetry={refetch}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Datasets</CardTitle>
            <CardDescription>
              {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Candles</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {dataset.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {dataset.description || '—'}
                    </TableCell>
                    <TableCell>{dataset.candles.length.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(Number(dataset.uploadedAt) / 1_000_000).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AsyncState>
    </div>
  );
}
