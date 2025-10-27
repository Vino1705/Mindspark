'use server';

/**
 * @fileOverview An AI agent that generates social media posts.
 *
 * - generateSocialMediaPost - A function that handles post generation.
 * - GenerateSocialMediaPostInput - The input type for the function.
 * - GenerateSocialMediaPostOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic or summary to create a post about.'),
  platform: z
    .enum(['Twitter', 'LinkedIn', 'Instagram'])
    .describe('The social media platform to target.'),
});
export type GenerateSocialMediaPostInput = z.infer<
  typeof GenerateSocialMediaPostInputSchema
>;

const GenerateSocialMediaPostOutputSchema = z.object({
  post: z.string().describe('The generated social media post, formatted with appropriate hashtags and tone for the platform.'),
});
export type GenerateSocialMediaPostOutput = z.infer<
  typeof GenerateSocialMediaPostOutputSchema
>;

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are a social media marketing expert. Your task is to create a compelling social media post based on the provided topic and target platform.

- If 'Twitter', write a concise, impactful tweet (under 280 characters) with 2-3 relevant hashtags.
- If 'LinkedIn', write a professional, insightful post (2-3 short paragraphs) with a clear hook, valuable content, and relevant business-oriented hashtags.
- If 'Instagram', write an engaging and slightly more personal caption (1-2 paragraphs) with a strong call-to-action or question, and include 5-7 relevant and popular hashtags.

Topic: {{{topic}}}
Platform: {{{platform}}}

Generated Post:`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
