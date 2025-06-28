import { PageHeader } from '@/components/page-header';
import { SetupGuide } from '@/components/setup-guide';
import { CodeAnalyzer } from '@/components/code-analyzer';
import { CommandManager } from '@/components/command-manager';
import { getFileContent } from '@/lib/github';
import { Separator } from '@/components/ui/separator';
import { DeployManager } from '@/components/deploy-manager';
import { BotRunner } from '@/components/bot-runner';

export default async function Home() {
  const [
    indexJsContent,
    pingJsContent,
    banJsContent,
    kickJsContent,
    readyJsContent,
    packageJsonContent,
  ] = await Promise.all([
    getFileContent('index.js'),
    getFileContent('comandos/ping.js'),
    getFileContent('comandos/ban.js'),
    getFileContent('comandos/kick.js'),
    getFileContent('eventos/ready.js'),
    getFileContent('package.json'),
  ]);

  const commands = [
    { name: 'ping', code: pingJsContent },
    { name: 'ban', code: banJsContent },
    { name: 'kick', code: kickJsContent },
  ];

  const files = [
    { name: 'index.js', code: indexJsContent },
    { name: 'eventos/ready.js', code: readyJsContent },
  ]

  let startCommand = "npm start";
  try {
    const pkg = JSON.parse(packageJsonContent);
    // Use `npm start` if available, otherwise fallback to `node .`
    if (pkg.scripts && pkg.scripts.start) {
      startCommand = "npm start";
    } else {
      startCommand = "node .";
    }
  } catch (e) {
    // Silently ignore parsing errors and use the default
    console.error("Could not parse package.json from GitHub", e);
  }

  return (
    <main>
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <PageHeader
          title="Discordian Deploy Enhanced"
          description="Your AI-powered assistant to deploy, manage, and improve your Discord.js bot."
        />
        <div className="flex flex-col gap-12 mt-8">
          <SetupGuide startCommand={startCommand} />
          <Separator />
          <BotRunner startCommand={startCommand} />
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
