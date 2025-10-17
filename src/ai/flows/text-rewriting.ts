'use server';

/**
 * @fileOverview A text rewriting AI agent.
 *
 * - rewriteText - A function that handles the text rewriting process.
 * - RewriteTextInput - The input type for the rewriteText function.
 * - RewriteTextOutput - The return type for the rewriteText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteTextInputSchema = z.object({
  text: z.string().describe('The text to rewrite.'),
  tone: z
    .enum(['Formal', 'Casual', 'Creative', 'Concise'])
    .describe('The tone to use when rewriting the text.'),
});
export type RewriteTextInput = z.infer<typeof RewriteTextInputSchema>;

const RewriteTextOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten text.'),
});
export type RewriteTextOutput = z.infer<typeof RewriteTextOutputSchema>;

export async function rewriteText(input: RewriteTextInput): Promise<RewriteTextOutput> {
  return rewriteTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteTextPrompt',
  input: {schema: RewriteTextInputSchema},
  output: {schema: RewriteTextOutputSchema},
  prompt: `You are a professional editor and marketing copywriter. Your task is to rewrite the given text in the specified tone, enhancing its quality, clarity, and impact while preserving the original meaning.

Rewrite the following text in a '{{{tone}}}' tone.

- If 'Formal', use professional language, structured sentences, and an authoritative tone suitable for business reports or academic papers. Avoid slang and contractions.
- If 'Casual', use a friendly, conversational style with simpler language and a relaxed tone, as if speaking to a colleague. Use contractions where appropriate.
- If 'Creative', use imaginative language, storytelling elements, and vivid imagery to make the content more engaging and memorable.
- If 'Concise', make the text as direct and to-the-point as possible. Remove filler words and redundant phrases without losing key information.

Original text:
{{{text}}}

Rewritten text:`,
});

const rewriteTextFlow = ai.defineFlow(
  {
    name: 'rewriteTextFlow',
    inputSchema: RewriteTextInputSchema,
    outputSchema: RewriteTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
