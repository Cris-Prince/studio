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
    return { error: 'Entrada de datos inválida.' };
  }

  try {
    const result = await suggestCodeimprovements(validatedData.data);
    return { improvements: result.improvements };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
    return { error: `Error al obtener sugerencias: ${message}` };
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
    return { error: 'Entrada de datos inválida.' };
  }

  try {
    const result = await generateCommandDescriptions(validatedData.data);
    return { description: result.description };
  } catch (e) {
     const message = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
    return { error: `Error al generar la descripción: ${message}` };
  }
}

export async function handleDeployCommands() {
  try {
    await deploySlashCommands();
    return { success: '¡Comandos desplegados exitosamente!' };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
    return { error: `Fallo al desplegar comandos: ${message}` };
  }
}
