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

Open the integrated terminal in VS Code (`Ctrl+` or `Cmd+\``) and install the project's dependencies using npm.

```bash
npm install
```

### 4. Set Up Environment Variables

The AI features in this application are powered by Google's Gemini models via Genkit. You will need a Gemini API key.

1.  Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/).
2.  Create a new file named `.env` in the root of your project.
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
