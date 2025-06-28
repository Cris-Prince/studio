'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CodeBlock } from './code-block';

interface BotRunnerProps {
  startCommand: string;
}

export function BotRunner({ startCommand }: BotRunnerProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-4">Bot Control</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Power /> Start Your Bot</CardTitle>
          <CardDescription>
            Use the instructions below to run your bot on your own computer or server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This web dashboard is for managing and analyzing your bot, but it cannot start or stop the bot process itself. You must run the bot from your own terminal.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full">
                <Power className="mr-2 h-4 w-4" /> Show Start Instructions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>How to Start Your Bot</AlertDialogTitle>
                <AlertDialogDescription>
                  Follow these steps in your computer's terminal to get your Discord bot online.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 my-4">
                  <div>
                      <p className="font-semibold text-sm mb-1">1. Open your terminal</p>
                      <p className="text-sm text-muted-foreground">Navigate to your bot's project directory.</p>
                  </div>
                  <div>
                      <p className="font-semibold text-sm mb-1">2. Install dependencies (if you haven't already)</p>
                      <CodeBlock code="npm install" />
                  </div>
                   <div>
                      <p className="font-semibold text-sm mb-1">3. Run the start command</p>
                      <CodeBlock code={startCommand} />
                  </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction>Got it!</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </section>
  );
}
