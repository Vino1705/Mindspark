'use server';

/**
 * @fileOverview An AI-powered brainstorming agent for blog post ideas.
 *
 * - aiBrainstorm - A function that handles the brainstorming process.
 * - AiBrainstormInput - The input type for the aiBrainstorm function.
 * - AiBrainstormOutput - The return type for the aiBrainstorm function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const AiBrainstormInputSchema = z.object({
  topic: z.string().describe('The topic or keyword to brainstorm blog posts about.'),
});
export type AiBrainstormInput = z.infer<typeof AiBrainstormInputSchema>;

const AiBrainstormOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of creative blog post ideas, including title, audience, keywords, and a brief outline.'),
});
export type AiBrainstormOutput = z.infer<typeof AiBrainstormOutputSchema>;

export async function aiBrainstorm(input: AiBrainstormInput): Promise<AiBrainstormOutput> {
  return aiBrainstormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiBrainstormPrompt',
  model: googleAI.model('gemini-2.5-flash'),
  input: {schema: AiBrainstormInputSchema},
  output: {schema: AiBrainstormOutputSchema},
  prompt: `You are an expert Content Strategist and SEO specialist. Your goal is to generate compelling blog post ideas based on a given topic.

For the topic below, generate 3 distinct and creative blog post ideas. For each idea, provide the following:
- A catchy, SEO-friendly title.
- The target audience for the post.
- A primary keyword and 2-3 secondary keywords.
- A brief, 2-3 sentence outline of the blog post structure.

Format each idea clearly.

Topic: {{{topic}}}
`,
});

const aiBrainstormFlow = ai.defineFlow(
  {
    name: 'aiBrainstormFlow',
    inputSchema: AiBrainstormInputSchema,
    outputSchema: AiBrainstormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
