'use client';

import { useState, useTransition } from 'react';
import { handleGenerateDescription } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CodeBlock } from './code-block';
import { Sparkles, Terminal, BookText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Command {
  name: string;
  code: string;
}

interface CommandManagerProps {
  commands: Command[];
}

export function CommandManager({ commands }: CommandManagerProps) {
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const { toast } = useToast();

  const generateDescription = (commandName: string, commandCode: string) => {
    const formData = new FormData();
    formData.append('commandCode', commandCode);

    setPendingCommand(commandName);
    setDescriptions(prev => ({ ...prev, [commandName]: '' }));

    startTransition(async () => {
      const result = await handleGenerateDescription(formData);
      if (result.error) {
        toast({
          title: "La Generación Falló",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setDescriptions(prev => ({ ...prev, [commandName]: result.description || 'No se generó ninguna descripción.' }));
      }
      setPendingCommand(null);
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-4">Centro de Comandos</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Terminal /> Comandos del Bot</CardTitle>
          <CardDescription>Explora los comandos del bot y genera descripciones amigables para el usuario con IA.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {commands.map((command) => (
              <AccordionItem value={command.name} key={command.name}>
                <AccordionTrigger className="font-headline capitalize">{command.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Código del Comando</h4>
                      <CodeBlock code={command.code} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Descripción Generada por IA</h4>
                      <Card className="min-h-[100px] flex items-center justify-center p-4 bg-background">
                        {descriptions[command.name] ? (
                           <p className="text-sm text-foreground flex items-start gap-2">
                             <BookText className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                             <span>{descriptions[command.name]}</span>
                           </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Haz clic en generar para crear una descripción.</p>
                        )}
                      </Card>
                      <form action={() => generateDescription(command.name, command.code)} className="mt-2">
                        <Button type="submit" size="sm" className="w-full" disabled={isPending && pendingCommand === command.name}>
                          {isPending && pendingCommand === command.name ? (
                            <><Sparkles className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
                          ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generar Descripción</>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
