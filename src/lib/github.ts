import { Buffer } from 'buffer';

export async function getFileContent(path: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/repos/Dsc-Bots/PruebaBot/contents/${path}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status} for path: ${path}`);
    }

    const data = await response.json();

    if (data.encoding !== 'base64') {
      throw new Error(`Unexpected encoding for file: ${data.encoding}`);
    }

    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error(`Failed to fetch file '${path}' from GitHub:`, error);
    return `// Could not load file: ${path}\n// ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
