'use client';

import { useState, useTransition } from 'react';
import { handleSuggestImprovements } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCode, Sparkles, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface CodeAnalyzerProps {
  files: { name: string; code: string }[];
}

const BEST_PRACTICES = `- Use environment variables for sensitive data like tokens.
- Implement proper error handling for async operations.
- Structure your code into modules (commands, events, etc.).
- Use a command handler to manage commands dynamically.
- Avoid using deprecated methods from Discord.js.
- Ensure all user inputs are validated and sanitized.`;

export function CodeAnalyzer({ files }: CodeAnalyzerProps) {
  const [improvements, setImprovements] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState(files[0].name);

  const analyzeCode = (formData: FormData) => {
    setImprovements('');
    startTransition(async () => {
      const result = await handleSuggestImprovements(formData);
      if (result.error) {
        toast({
          title: "Analysis Failed",
          description: result.error,
          variant: "destructive",
        });
        setImprovements('');
      } else {
        setImprovements(result.improvements || 'No suggestions available.');
      }
    });
  };

  const currentCode = files.find(f => f.name === selectedFile)?.code || '';

  return (
    <section>
       <h2 className="text-2xl font-bold font-headline mb-4">Code Quality Analysis</h2>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileCode /> Bot Source Code</CardTitle>
            <CardDescription>Review the bot's code and get AI-powered improvement suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedFile} onValueChange={setSelectedFile} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                {files.map(file => (
                  <TabsTrigger key={file.name} value={file.name}>{file.name}</TabsTrigger>
                ))}
              </TabsList>
              {files.map(file => (
                <TabsContent key={file.name} value={file.name}>
                  <ScrollArea className="h-96 rounded-md border">
                    <pre className="p-4 text-sm"><code>{file.code}</code></pre>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>

            <Card className="mt-4 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Best Practices Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{BEST_PRACTICES}</pre>
              </CardContent>
            </Card>

            <form action={analyzeCode} className="mt-4">
              <input type="hidden" name="code" value={currentCode} />
              <input type="hidden" name="bestPractices" value={BEST_PRACTICES} />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <><Sparkles className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" /> Suggest Improvements</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="sticky top-4">
          <Card className="min-h-[30rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> Improvement Suggestions</CardTitle>
              <CardDescription>Our AI has analyzed your code. Here's what it found.</CardDescription>
            </CardHeader>
            <CardContent>
              {isPending && (
                <div className="flex items-center justify-center h-40">
                  <Sparkles className="h-8 w-8 text-muted-foreground animate-spin" />
                </div>
              )}
              {improvements && !isPending && (
                <Alert className="bg-background">
                  <Wand2 className="h-4 w-4" />
                  <AlertTitle>Analysis Complete</AlertTitle>
                  <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {improvements}
                  </AlertDescription>
                </Alert>
              )}
              {!improvements && !isPending && (
                <div className="text-center text-muted-foreground py-10 px-4">
                  <p>Click "Suggest Improvements" to analyze the selected code file.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
