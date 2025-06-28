import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Terminal } from "lucide-react";
import { CodeBlock } from "./code-block";

interface SetupGuideProps {
  startCommand: string;
}

export function SetupGuide({ startCommand }: SetupGuideProps) {
  const steps = [
    {
      title: "1. Clonar Repositorio",
      description: "Obtén el código fuente del bot en tu máquina local.",
      command: "gh repo clone Dsc-Bots/PruebaBot",
    },
    {
      title: "2. Instalar Dependencias",
      description: "Instala todos los paquetes necesarios para que el bot funcione.",
      command: "npm install",
    },
    {
      title: "3. Iniciar el Bot",
      description: "Ejecuta el bot para ponerlo en línea.",
      command: startCommand,
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-4">Guía de Configuración Rápida</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="flex flex-col bg-card/50 hover:bg-card transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-headline text-lg">{step.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <CodeBlock code={step.command} />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center text-accent flex items-center justify-center gap-2">
        <CheckCircle2 className="h-5 w-5" />
        <p>Sigue estos pasos en tu terminal para comenzar.</p>
      </div>
    </section>
  );
}
