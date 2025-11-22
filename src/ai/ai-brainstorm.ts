'use server';

/**
 * @fileOverview An AI-powered brainstorming agent for blog post ideas.
 *
 * - aiBrainstorm - A function that handles the brainstorming process.
 * - AiBrainstormInput - The input type for the aiBrainstorm function.
 * - AiBrainstormOutput - The return type for the aiBrainstorm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiBrainstormInputSchema = z.object({
  topic: z.string().describe('The topic or keyword to brainstorm blog posts about.'),
  platform: z
    .enum(['Blog', 'LinkedIn', 'Instagram'])
    .describe('The target platform for the content ideas.'),
});
export type AiBrainstormInput = z.infer<typeof AiBrainstormInputSchema>;

const AiBrainstormOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of creative content ideas, including title, audience, keywords, and a brief outline formatted for the specified platform.'),
});
export type AiBrainstormOutput = z.infer<typeof AiBrainstormOutputSchema>;

export async function aiBrainstorm(input: AiBrainstormInput): Promise<AiBrainstormOutput> {
  return aiBrainstormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiBrainstormPrompt',
  input: {schema: AiBrainstormInputSchema},
  output: {schema: AiBrainstormOutputSchema},
  prompt: `You are an expert Content Strategist and SEO specialist. Your goal is to generate compelling content ideas based on a given topic and target platform.

For the topic and platform below, generate 3 distinct and creative content ideas. For each idea, provide the following, tailored specifically for the platform:

- If 'Blog': A catchy, SEO-friendly title, target audience, primary/secondary keywords, and a 2-3 sentence outline.
- If 'LinkedIn': A professional, attention-grabbing hook, the main post body (3-4 concise paragraphs), relevant hashtags, and a call-to-action.
- If 'Instagram': A short, engaging caption, a suggestion for the visual (e.g., photo, carousel, Reel), and 5-7 relevant hashtags.

Format each idea clearly.

Topic: {{{topic}}}
Platform: {{{platform}}}
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


