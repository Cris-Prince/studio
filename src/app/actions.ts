'use server';

import { suggestCodeImprovements } from '@/ai/flows/suggest-code-improvements';
import { generateCommandDescriptions } from '@/ai/flows/generate-command-descriptions';
import { z } from 'zod';
import { deploySlashCommands } from '@/lib/discord';

const improveCodeSchema = z.object({
  code: z.string(),
  bestPractices: z.string(),
});

export async function handleSuggestImprovements(formData: FormData) {
  const rawData = {
    code: formData.get('code'),
    bestPractices: formData.get('bestPractices'),
  };

  const validatedData = improveCodeSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await suggestCodeImprovements(validatedData.data);
    return { improvements: result.improvements };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to get suggestions from AI: ${message}` };
  }
}

const generateDescriptionSchema = z.object({
  commandCode: z.string(),
});

export async function handleGenerateDescription(formData: FormData) {
  const rawData = {
    commandCode: formData.get('commandCode'),
  };

  const validatedData = generateDescriptionSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await generateCommandDescriptions(validatedData.data);
    return { description: result.description };
  } catch (e) {
     const message = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to get description from AI: ${message}` };
  }
}

export async function handleDeployCommands() {
  try {
    await deploySlashCommands();
    return { success: 'Commands deployed successfully!' };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to deploy commands: ${message}` };
  }
}
