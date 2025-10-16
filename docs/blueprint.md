# **App Name**: MindSpark

## Core Features:

- Dashboard: Central hub with access to all AI tools: Brainstorm, Rewriter, Proofreader, and Summarizer.
- AI-Powered Brainstorming: Generates creative ideas and outlines based on user input, even offline, using Gemini Nano or a mock AI tool when the API is unavailable.
- Text Rewriting: Rewrites input text with different tone options using the Writer/Rewriter API, providing a side-by-side comparison of the original and rewritten text.
- Proofreading: Identifies grammar, punctuation, and clarity issues, suggesting inline corrections using the Proofreader API.
- Text Summarization: Generates concise summaries or bullet points from input text or uploaded files using AI tool. The user has the option to copy or export the summary.
- Local Draft Management: Saves drafts in IndexedDB with timestamps, allowing users to delete, rename, or export them as .txt or .md files. This provides a basic tool for data management.
- Offline Support: Uses a Service Worker to cache assets and drafts, providing a demo experience with mock AI when offline. Error Handling informs user that the app is running in demo mode.

## Style Guidelines:

- Primary color: Electric blue (#7DF9FF), reflecting innovation and technology.
- Background color: Light gray (#E0E0E0), providing a neutral backdrop.
- Accent color: Light cyan (#E0FFFF), complementing the electric blue.
- Body and headline font: 'Inter', a sans-serif font for a modern, objective feel.
- Use lucide-react icons for a minimalist and consistent design.
- Responsive grid/flex layouts with rounded components and soft shadows.
- Smooth fade or slide transitions between pages, with animated typing effects for AI responses.