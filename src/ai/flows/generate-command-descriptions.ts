'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate descriptions for Discord bot commands.
 *
 * The flow uses the command's code to create a natural language description, helping users understand each command's function.
 *
 * @exports {generateCommandDescriptions} - The function to generate command descriptions.
 * @exports {GenerateCommandDescriptionsInput} - The input type for the generateCommandDescriptions function.
 * @exports {GenerateCommandDescriptionsOutput} - The output type for the generateCommandDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommandDescriptionsInputSchema = z.object({
  commandCode: z.string().describe('The code of the Discord bot command.'),
});

export type GenerateCommandDescriptionsInput = z.infer<typeof GenerateCommandDescriptionsInputSchema>;

const GenerateCommandDescriptionsOutputSchema = z.object({
  description: z.string().describe('A natural language description of the command.'),
});

export type GenerateCommandDescriptionsOutput = z.infer<typeof GenerateCommandDescriptionsOutputSchema>;

export async function generateCommandDescriptions(input: GenerateCommandDescriptionsInput): Promise<GenerateCommandDescriptionsOutput> {
  return generateCommandDescriptionsFlow(input);
}

const generateCommandDescriptionsPrompt = ai.definePrompt({
  name: 'generateCommandDescriptionsPrompt',
  input: {schema: GenerateCommandDescriptionsInputSchema},
  output: {schema: GenerateCommandDescriptionsOutputSchema},
  prompt: `You are a Discord bot expert. Generate a concise and user-friendly description for the following Discord bot command code:

  Command Code:
  {{commandCode}}

  Description:`, // Just ask for the bot command description.
});

const generateCommandDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateCommandDescriptionsFlow',
    inputSchema: GenerateCommandDescriptionsInputSchema,
    outputSchema: GenerateCommandDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await generateCommandDescriptionsPrompt(input);
    return output!;
  }
);
