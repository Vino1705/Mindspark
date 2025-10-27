'use server';

/**
 * @fileOverview An AI agent that expands a short piece of text into a full paragraph.
 *
 * - expandContent - A function that handles the content expansion.
 * - ExpandContentInput - The input type for the expandContent function.
 * - ExpandContentOutput - The return type for the expandContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpandContentInputSchema = z.object({
  text: z.string().describe('The short text or bullet points to expand.'),
});
export type ExpandContentInput = z.infer<typeof ExpandContentInputSchema>;

const ExpandContentOutputSchema = z.object({
  expandedContent: z.string().describe('The expanded, full-paragraph content.'),
});
export type ExpandContentOutput = z.infer<typeof ExpandContentOutputSchema>;

export async function expandContent(input: ExpandContentInput): Promise<ExpandContentOutput> {
  return expandContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expandContentPrompt',
  input: {schema: ExpandContentInputSchema},
  output: {schema: ExpandContentOutputSchema},
  prompt: `You are a skilled content writer. Take the following sentence, phrase, or bullet points and expand it into a well-written, coherent paragraph. Maintain the core idea of the original text but build upon it with additional detail, explanation, or context.

Original text:
{{{text}}}

Expanded paragraph:`,
});

const expandContentFlow = ai.defineFlow(
  {
    name: 'expandContentFlow',
    inputSchema: ExpandContentInputSchema,
    outputSchema: ExpandContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
