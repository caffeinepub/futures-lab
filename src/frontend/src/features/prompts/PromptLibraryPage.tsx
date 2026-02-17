import { useState, useEffect } from 'react';
import { useGetAllPromptTemplates, useSavePromptTemplate } from '../../lib/queries';
import { AsyncState } from '../../components/system/AsyncState';
import { SEED_TEMPLATES } from './promptSeeds';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PromptLibraryPage() {
  const { data: templates = [], isLoading, isError, error, refetch } = useGetAllPromptTemplates();
  const saveTemplate = useSavePromptTemplate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [example, setExample] = useState('');
  const [hasSeeded, setHasSeeded] = useState(false);

  useEffect(() => {
    if (!isLoading && templates.length === 0 && !hasSeeded) {
      seedDefaultTemplates();
      setHasSeeded(true);
    }
  }, [isLoading, templates.length, hasSeeded]);

  const seedDefaultTemplates = async () => {
    for (const seed of SEED_TEMPLATES) {
      try {
        await saveTemplate.mutateAsync({
          id: seed.id,
          name: seed.name,
          content: seed.content,
          category: seed.category,
          example: seed.example,
          createdAt: BigInt(Date.now() * 1_000_000),
          updatedAt: BigInt(Date.now() * 1_000_000),
          owner: '' as any, // Will be set by backend
        });
      } catch (error) {
        console.error('Failed to seed template:', error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await saveTemplate.mutateAsync({
        id: `template-${Date.now()}`,
        name: name.trim(),
        content: content.trim(),
        category: category.trim() || 'General',
        example: example.trim() || undefined,
        createdAt: BigInt(Date.now() * 1_000_000),
        updatedAt: BigInt(Date.now() * 1_000_000),
        owner: '' as any, // Will be set by backend
      });
      
      setIsDialogOpen(false);
      setName('');
      setContent('');
      setCategory('');
      setExample('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save template');
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Template copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prompt Library</h2>
          <p className="text-muted-foreground mt-1">
            Manage your AI prompt templates
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Prompt Template</DialogTitle>
              <DialogDescription>
                Add a new prompt template to your library
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Template name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Analysis"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Prompt Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your prompt template..."
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="example">Example Usage</Label>
                <Textarea
                  id="example"
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Optional example of how to use this template"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={saveTemplate.isPending}>
                {saveTemplate.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Template'
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
        isEmpty={templates.length === 0}
        emptyMessage="No prompt templates yet. Create your first template to get started."
        onRetry={refetch}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {template.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(template.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.content}
                </p>
                {template.example && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Example:</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.example}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncState>
    </div>
  );
}
