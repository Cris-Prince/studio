import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Terminal } from "lucide-react";
import { CodeBlock } from "./code-block";

interface SetupGuideProps {
  startCommand: string;
}

export function SetupGuide({ startCommand }: SetupGuideProps) {
  const steps = [
    {
      title: "1. Clone Repository",
      description: "Get the bot's source code onto your local machine.",
      command: "gh repo clone Dsc-Bots/PruebaBot",
    },
    {
      title: "2. Install Dependencies",
      description: "Install all the necessary packages for the bot to run.",
      command: "npm install",
    },
    {
      title: "3. Start the Bot",
      description: "Run the bot and bring it online.",
      command: startCommand,
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-4">Quick Setup Guide</h2>
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
        <p>Follow these steps in your terminal to get started.</p>
      </div>
    </section>
  );
}
