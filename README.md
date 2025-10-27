# ContentSpark

This is a Next.js application, built in Firebase Studio, that acts as an AI-powered content creation assistant. It's designed to help marketers, writers, and content creators streamline their workflow from idea to publication.

## About The Project

### Inspiration

The inspiration for **ContentSpark** came from a common struggle faced by anyone who creates content: the friction in the creative process. For writers, marketers, and students, the journey from a blank page to a polished piece involves multiple, disconnected steps. You might use one tool to brainstorm ideas, another to write, a third to proofread, and yet another to adjust the tone for different audiences. I wanted to build a single, cohesive application that streamlines this entire workflow, creating an intelligent partner that helps overcome writer's block and handles the tedious parts of content creation.

### What it does

ContentSpark is an all-in-one content creation toolkit. It offers a suite of AI-powered features to assist you at every stage of the writing process:

-   **Blog Idea Generator**: Brainstorms new content ideas, complete with catchy titles, target audiences, relevant keywords, and a structural outline.
-   **Tone Adjuster**: Rewrites your text in various tones (Formal, Casual, Creative, Concise) to match your intended audience.
-   **Proofreader**: Checks your text for grammar, spelling, and punctuation errors, providing corrected text and actionable suggestions.
-   **Summarizer**: Condenses long articles or documents into brief, easy-to-digest summaries.
-   **Save Drafts**: All generated content can be saved locally in your browser using IndexedDB, allowing you to revisit your work at any time.

### How we built it

ContentSpark was built iteratively, starting with a modern foundation and layering on features and fixes.

1.  **Foundation:** The project began with a **Next.js 15** starter template, configured with **Tailwind CSS** and **ShadCN UI** for a modern, component-based design system.
2.  **Core AI Flows:** I designed and implemented the four main AI features using **Genkit**, Google's generative AI framework. For each feature, I created a dedicated flow with a Zod schema for typed inputs and outputs and a carefully crafted prompt to guide the Gemini model.
3.  **Frontend Implementation:** I built the UI for each feature using React and ShadCN components, creating forms, managing loading states, and displaying the AI-generated results with a "typing" animation for a better user experience.
4.  **Drafts Feature:** To allow users to save their work, I implemented a client-side database using **IndexedDB**, creating a simple library to handle all database operations (add, get, delete).
5.  **Refinement and Debugging:** The final phase involved significant debugging. After encountering persistent hydration errors, I rebuilt the sidebar navigation from scratch, simplifying the component structure to resolve the conflicts and stabilize the application.

### Challenges we ran into

The most significant challenge was a series of persistent **Next.js hydration errors**. These errors were difficult to debug because they stemmed from a subtle conflict between server and client rendering in the complex navigation component. My initial attempts to patch the problem failed, which taught me that sometimes, the best solution is to rebuild from scratch with a simpler, more fundamental approach. Refactoring the navigation was a major undertaking, but it was the key to making the application robust.

Another challenge was fine-tuning the **AI prompts**. Getting the Gemini model to produce consistently high-quality, structured output required many iterations of prompt engineering.

### Accomplishments that we're proud of

-   **Building a Full-Stack AI Application:** I'm proud of creating a complete, functional tool from the ground up, integrating a sophisticated AI backend with a polished and responsive frontend.
-   **Solving Complex Technical Issues:** Overcoming the persistent hydration errors was a major accomplishment. It required deep debugging, research, and the willingness to discard a complex solution in favor of a simple, correct one.
-   **Creating a Seamless User Experience:** From the real-time "typing" animation for AI responses to the ability to save drafts locally, I focused on creating an intuitive and useful experience for the end-user.

### What we learned

-   **Next.js App Router In-Depth:** I learned how to structure a full-stack application using the Next.js App Router, leveraging Server Components for performance and Client Components for interactivity. This included a hard-won, practical understanding of how to avoid hydration mismatches.
-   **Practical Generative AI Integration:** This project was a deep dive into **Genkit**. I learned how to define AI flows, create structured inputs and outputs with Zod schemas, and write sophisticated prompts to instruct a large language model.
-   **The Power of Simplification:** The biggest lesson was that complex problems don't always require complex solutions. Rebuilding the navigation with a simpler, more standard approach was far more effective than trying to patch a flawed design.

### What's next for ContentSpark

There are many exciting possibilities for the future of ContentSpark:

-   **User Accounts and Cloud Sync:** Adding Firebase Authentication to allow users to save drafts to the cloud and access them from any device.
-   **Multi-Language Support:** Expanding the AI flows to support proofreading and rewriting in multiple languages.
-   **Advanced Content Formats:** Introducing new tools to generate social media posts, email newsletters, or even scripts based on a user's input.
-   **Plagiarism Checker:** Integrating a tool to check for originality.

---

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
