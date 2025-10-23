# ContentSpark

This is a Next.js application, built in Firebase Studio, that acts as an AI-powered content creation assistant. It's designed to help marketers, writers, and content creators streamline their workflow from idea to publication.

## Core Features

-   **Blog Idea Generator**: Brainstorms new content ideas with titles, target audiences, keywords, and outlines.
-   **Tone Adjuster**: Rewrites text in various tones (Formal, Casual, Creative, Concise).
-   **Proofreader**: Checks text for grammar, spelling, and punctuation errors.
-   **Summarizer**: Condenses long-form text into brief, single-paragraph summaries.
-   **Drafts**: Save generated content locally in your browser to access later.

---

## About The Project

### Inspiration

The inspiration for **ContentSpark** came from a common struggle faced by anyone who creates content: the friction in the creative process. For writers, marketers, and students, the journey from a blank page to a polished piece involves multiple, disconnected steps. You might use one tool to brainstorm ideas, another to write, a third to proofread, and yet another to adjust the tone for different audiences.

I wanted to build a single, cohesive application that streamlines this entire workflow. The goal was to create an intelligent partner that could help overcome writer's block, refine a message, and handle the tedious parts of content creation, allowing the user to focus on their core ideas.

### What I Learned

Building ContentSpark was a deep dive into the world of modern web development and generative AI.

-   **Full-Stack with Next.js App Router:** I learned how to structure a full-stack application using the Next.js App Router, leveraging Server Components for performance and Client Components for interactivity.
-   **Integrating Generative AI:** This project was my first real experience with **Genkit**, Google's generative AI framework. I learned how to define AI flows, create structured inputs and outputs with Zod schemas, and write sophisticated prompts that instruct the Gemini model to perform specific, high-quality tasks.
-   **Debugging in a Modern Framework:** The journey was not without its challenges. I faced and overcame persistent **Next.js hydration errors**, which taught me invaluable lessons about the importance of ensuring that server-rendered and client-rendered HTML match perfectly. Resolving this required a deep understanding of component lifecycles and led me to refactor the navigation from a complex, error-prone structure to a simple, robust one.
-   **Client-Side Storage:** I implemented a drafts feature using **IndexedDB**, learning how to manage persistent local storage in the browser to provide a seamless user experience without needing a backend database for this feature.

### How It's Built

ContentSpark was built iteratively, starting with a foundation and layering on features and fixes.

1.  **Foundation:** The project began with a **Next.js 15** starter template, configured with **Tailwind CSS** and **ShadCN UI** for a modern, component-based design system.
2.  **Core AI Flows:** I then designed and implemented the four main AI features. For each feature (Brainstorm, Rewrite, Proofread, Summarize), I created a dedicated **Genkit flow** in `src/ai/flows/`. Each flow has a Zod schema for typed inputs and outputs and a carefully crafted prompt to guide the Gemini model.
3.  **Frontend Implementation:** With the AI backend in place, I built the UI for each feature using React and ShadCN components. This included creating forms, handling user input, managing loading states, and displaying the AI-generated results with a "typing" animation for a better user experience.
4.  **Saving Drafts:** To allow users to save their work, I implemented a simple client-side database using IndexedDB. I created a `db.ts` library to handle all database operations (add, get, delete), which is used by the different AI tool pages.
5.  **Refinement and Debugging:** The final phase involved significant debugging and refinement. After encountering persistent hydration errors, I completely rebuilt the sidebar navigation, simplifying the component structure to resolve the conflicts between Next.js's `<Link>` and custom button components. This was a critical step that made the application stable and error-free.

### Challenges Faced

The most significant challenge was undoubtedly the series of **hydration errors**. These errors were difficult to debug because they stemmed from a subtle conflict between server and client rendering in a complex component. My initial attempts to patch the problem failed, which taught me that sometimes, the best solution is to step back and **rebuild from scratch** with a simpler, more fundamental approach. Refactoring the entire navigation system was a major undertaking, but it was the key to making the application robust.

Another challenge was fine-tuning the **AI prompts**. Getting the AI to produce consistently high-quality, structured output required many iterations of prompt engineering. Learning to "think" like the model and provide clear, unambiguous instructions was a crucial skill I developed during this project.

## Built With

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
*   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
*   **Local Storage**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for saving drafts in the browser.

---

## Running Locally from VS Code

To run this project on your local machine using Visual Studio Code, follow these steps.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [Visual Studio Code](https://code.visualstudio.com/)

### 2. Clone the Repository

First, clone your repository from GitHub to your local machine and open it in VS Code.

```bash
git clone <your-github-repository-url>
cd <repository-folder>
code .
```

### 3. Install Dependencies

Open the integrated terminal in VS Code (`Ctrl+\`` or `Cmd+\``) and install the project's dependencies using npm.

```bash
npm install
```

### 4. Set Up Environment Variables

The AI features in this application are powered by Google's Gemini models via Genkit. You will need a Gemini API key.

1.  Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/).
2.  Open the `.env` file in the root of your project.
3.  Add your API key to the `.env` file like this:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### 5. Run the Development Servers

This project requires two development servers to be running simultaneously:

-   The **Next.js frontend server**.
-   The **Genkit AI server** that powers the backend flows.

You will need to open two separate terminals in VS Code to run them.

**In your first terminal, run the Next.js app:**

```bash
npm run dev
```

This will start the frontend application, typically available at `http://localhost:3000`.

**In your second terminal, run the Genkit server:**

```bash
npm run genkit:watch
```

This starts the Genkit flows and will automatically restart if you make any changes to the AI agent files.

Once both servers are running, you can open your browser to `http://localhost:3000` to use the application. The frontend will automatically proxy AI requests to the Genkit server.
