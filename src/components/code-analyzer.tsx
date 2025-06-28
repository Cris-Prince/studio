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

const BEST_PRACTICES = `- Usa variables de entorno para datos sensibles como tokens.
- Implementa un manejo de errores adecuado para operaciones asíncronas.
- Estructura tu código en módulos (comandos, eventos, etc.).
- Usa un manejador de comandos para gestionarlos dinámicamente.
- Evita usar métodos obsoletos de Discord.js.
- Asegúrate de que todas las entradas de usuario sean validadas y sanitizadas.`;

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
          title: "Análisis Fallido",
          description: result.error,
          variant: "destructive",
        });
        setImprovements('');
      } else {
        setImprovements(result.improvements || 'No hay sugerencias disponibles.');
      }
    });
  };

  const currentCode = files.find(f => f.name === selectedFile)?.code || '';

  return (
    <section>
       <h2 className="text-2xl font-bold font-headline mb-4">Análisis de Calidad de Código</h2>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileCode /> Código Fuente del Bot</CardTitle>
            <CardDescription>Revisa el código de tu bot y obtén sugerencias de mejora con IA.</CardDescription>
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
                <CardTitle className="text-base">Lista de Mejores Prácticas</CardTitle>
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
                  <><Sparkles className="mr-2 h-4 w-4 animate-spin" /> Analizando...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" /> Sugerir Mejoras</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="sticky top-4">
          <Card className="min-h-[30rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> Sugerencias de Mejora</CardTitle>
              <CardDescription>Nuestra IA ha analizado tu código. Esto es lo que encontró.</CardDescription>
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
                  <AlertTitle>Análisis Completo</AlertTitle>
                  <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {improvements}
                  </AlertDescription>
                </Alert>
              )}
              {!improvements && !isPending && (
                <div className="text-center text-muted-foreground py-10 px-4">
                  <p>Haz clic en "Sugerir Mejoras" para analizar el archivo de código seleccionado.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
