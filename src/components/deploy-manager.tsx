'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle2, AlertTriangle } from 'lucide-react';
import { handleDeployCommands } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '@/hooks/use-toast';

export function DeployManager() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
    const { toast } = useToast();

    const onDeploy = () => {
        setResult(null);
        startTransition(async () => {
            const deploymentResult = await handleDeployCommands();
            setResult(deploymentResult);
            if (deploymentResult.error) {
                toast({
                    title: "Deployment Failed",
                    description: deploymentResult.error,
                    variant: "destructive",
                });
            } else {
                 toast({
                    title: "Deployment Successful",
                    description: deploymentResult.success,
                });
            }
        });
    };

    return (
        <section>
            <h2 className="text-2xl font-bold font-headline mb-4">Deployment Control</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Rocket /> Deploy Commands</CardTitle>
                    <CardDescription>
                        Register or update your bot's slash commands on Discord.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            Click the button below to deploy your slash commands. This will make them available for users on Discord. Ensure your `CLIENT_ID` and `DISCORD_TOKEN` are set correctly in your environment.
                        </p>
                        <form action={onDeploy}>
                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? (
                                    <><Rocket className="mr-2 h-4 w-4 animate-spin" /> Deploying...</>
                                ) : (
                                    <><Rocket className="mr-2 h-4 w-4" /> Deploy Slash Commands</>
                                )}
                            </Button>
                        </form>
                        {result && !isPending && (
                             <Alert variant={result.error ? 'destructive' : 'default'} className={result.success ? "border-green-500/50 text-green-700 dark:text-green-400 dark:border-green-500/50" : ""}>
                                {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
                                <AlertDescription>
                                    {result.success || result.error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
