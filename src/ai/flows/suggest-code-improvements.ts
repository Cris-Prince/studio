'use server';

/**
 * @fileOverview Suggests improvements to the bot's code based on best practices.
 *
 * - suggestCodeImprovements - A function that suggests improvements to the bot's code.
 * - SuggestCodeImprovementsInput - The input type for the suggestCodeImprovements function.
 * - SuggestCodeImprovementsOutput - The return type for the suggestCodeImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeImprovementsInputSchema = z.object({
  code: z.string().describe('The code to analyze for improvements.'),
  bestPractices: z.string().describe('A list of best practices to follow.'),
});

export type SuggestCodeImprovementsInput = z.infer<typeof SuggestCodeImprovementsInputSchema>;

const SuggestCodeImprovementsOutputSchema = z.object({
  improvements: z.string().describe('The suggested improvements for the code.'),
});

export type SuggestCodeImprovementsOutput = z.infer<typeof SuggestCodeImprovementsOutputSchema>;

export async function suggestCodeImprovements(
  input: SuggestCodeImprovementsInput
): Promise<SuggestCodeImprovementsOutput> {
  return suggestCodeImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeImprovementsPrompt',
  input: {schema: SuggestCodeImprovementsInputSchema},
  output: {schema: SuggestCodeImprovementsOutputSchema},
  prompt: `You are a senior software engineer reviewing code for a Discord bot.

      Based on the following best practices:
      {{bestPractices}}

      Suggest improvements for the following code:
      {{code}}

      Focus on code quality, maintainability, and adherence to the provided best practices.
      Return the suggested improvements in a clear and concise manner.
    `,
});

const suggestCodeImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestCodeImprovementsFlow',
    inputSchema: SuggestCodeImprovementsInputSchema,
    outputSchema: SuggestCodeImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
