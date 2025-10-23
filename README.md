# ContentSpark

This is a Next.js application, built in Firebase Studio, that acts as an AI-powered content creation assistant. It's designed to help marketers, writers, and content creators streamline their workflow from idea to publication.

## What is ContentSpark?

**ContentSpark** is your AI partner for creating exceptional marketing content. It solves several common problems:

-   **Writer's Block:** The **Blog Idea Generator** helps you overcome creative hurdles by providing not just topics, but also target audiences, keywords, and outlines to get you started.
-   **Polishing Your Message:** The **Tone Adjuster**, **Proofreader**, and **Summarizer** tools allow you to refine your writing. You can adapt your text for different audiences, ensure it's error-free, and create quick summaries for social media or busy readers.
-   **Improving Workflow:** By integrating these tools into a single, cohesive application with the ability to save your work as drafts, ContentSpark streamlines the content creation process.

## Core Features

-   **Blog Idea Generator**: Brainstorms new content ideas with titles, target audiences, keywords, and outlines.
-   **Tone Adjuster**: Rewrites text in various tones (Formal, Casual, Creative, Concise).
-   **Proofreader**: Checks text for grammar, spelling, and punctuation errors.
-   **Summarizer**: Condenses long-form text into brief, single-paragraph summaries.
-   **Drafts**: Save generated content locally in your browser to access later.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
-   **Local Storage**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for saving drafts in the browser.
