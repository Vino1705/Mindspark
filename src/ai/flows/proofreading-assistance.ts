'use server';

/**
 * @fileOverview Proofreading assistance AI agent.
 *
 * - proofreadText - A function that handles the proofreading process.
 * - ProofreadTextInput - The input type for the proofreadText function.
 * - ProofreadTextOutput - The return type for the proofreadText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProofreadTextInputSchema = z.object({
  text: z.string().describe('The text to proofread.'),
});
export type ProofreadTextInput = z.infer<typeof ProofreadTextInputSchema>;

const ProofreadTextOutputSchema = z.object({
  correctedText: z.string().describe('The proofread and corrected text.'),
  suggestions: z.array(
    z.object({
      startIndex: z.number().describe('The starting index of the issue.'),
      length: z.number().describe('The length of the issue.'),
      suggestion: z.string().describe('The suggested correction.'),
    })
  ).optional().describe('List of suggested corrections.'),
});
export type ProofreadTextOutput = z.infer<typeof ProofreadTextOutputSchema>;

export async function proofreadText(input: ProofreadTextInput): Promise<ProofreadTextOutput> {
  return proofreadTextFlow(input);
}

const proofreadTextPrompt = ai.definePrompt({
  name: 'proofreadTextPrompt',
  input: {schema: ProofreadTextInputSchema},
  output: {schema: ProofreadTextOutputSchema},
  prompt: `You are a professional proofreader. Review the following text for grammar, punctuation, spelling, and clarity issues. Provide a corrected version of the text and, if possible, a list of suggestions for each identified issue, including the start index, length, and suggested correction.

Text to proofread: {{{text}}}`,
});

const proofreadTextFlow = ai.defineFlow(
  {
    name: 'proofreadTextFlow',
    inputSchema: ProofreadTextInputSchema,
    outputSchema: ProofreadTextOutputSchema,
  },
  async input => {
    const {output} = await proofreadTextPrompt(input);
    return output!;
  }
);
