import { PageHeader } from '@/components/page-header';
import { SetupGuide } from '@/components/setup-guide';
import { CodeAnalyzer } from '@/components/code-analyzer';
import { CommandManager } from '@/components/command-manager';
import { getFileContent } from '@/lib/github';
import { Separator } from '@/components/ui/separator';
import { DeployManager } from '@/components/deploy-manager';
import { BotRunner } from '@/components/bot-runner';

export default async function Home() {
  const [indexJsContent, pingJsContent, readyJsContent, packageJsonContent] = await Promise.all([
    getFileContent('index.js'),
    getFileContent('comandos/ping.js'),
    getFileContent('eventos/ready.js'),
    getFileContent('package.json'),
  ]);

  const commands = [
    { name: 'ping', code: pingJsContent },
  ];

  const files = [
    { name: 'index.js', code: indexJsContent },
    { name: 'eventos/ready.js', code: readyJsContent },
  ]

  return (
    <main>
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <PageHeader
          title="Discordian Deploy Enhanced"
          description="Your AI-powered assistant to deploy, manage, and improve your Discord.js bot."
        />
        <div className="flex flex-col gap-12 mt-8">
          <SetupGuide packageJson={packageJsonContent} />
          <Separator />
          <BotRunner />
          <Separator />
          <DeployManager />
          <Separator />
          <CodeAnalyzer files={files} />
          <Separator />
          <CommandManager commands={commands} />
        </div>
      </div>
    </main>
  );
}
