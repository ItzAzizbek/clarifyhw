# ClarifyHW

ClarifyHW is a full-stack homework explanation app designed for parents. It helps you turn a photo or written homework problem into a clear, structured, parent-friendly explanation that is easier to understand and easier to teach back.

The project combines a modern React frontend with an Express API powered by Google's Gemini model. The result is a lightweight interface for uploading homework, receiving step-by-step breakdowns, and guiding children with calmer, clearer support at home.

## Overview

ClarifyHW is built around a simple idea: parents often understand less about the format of modern homework than they would like, but they still want to help with confidence. Instead of generating dense tutor-style answers, the app focuses on short explanations, practical steps, and natural language parents can use when talking through a problem with a child.

## Features

- Photo upload workflow for homework images
- Text input workflow for typed or pasted homework problems
- Parent-friendly AI explanations with a concise final answer
- Step-by-step breakdowns with plain-language guidance
- "How to say it" prompts for explaining each step aloud
- Clean multi-page interface built with React, Vite, and Tailwind CSS
- Express backend with image upload support via `multer`
- Gemini-powered explanation generation
- Optional Google AdSense banner support for the web client

## Tech Stack

### Frontend

- React 19
- Vite 5
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React
- React Markdown

### Backend

- Node.js
- Express
- Multer
- CORS
- dotenv
- `@google/generative-ai`

## Project Structure

```text
ClarifyHW/
├─ client/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .env.example
│  ├─ package.json
│  └─ vite.config.js
├─ server/
│  ├─ routes/
│  │  └─ explain.js
│  ├─ .env
│  ├─ index.js
│  └─ package.json
└─ README.md
```

## How It Works

1. A parent uploads a homework image or pastes a problem as text.
2. The frontend sends the request to the Express API.
3. The server packages the text and optional image for Gemini.
4. Gemini returns a structured JSON explanation.
5. The frontend displays the answer, step-by-step explanation, and parent guidance.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or newer
- npm
- A Google Gemini API key

### 1. Install dependencies

Install client dependencies:

```bash
npm install
```

Run that command in:

```text
client/
```

Install server dependencies:

```bash
npm install
```

Run that command in:

```text
server/
```

### 2. Configure environment variables

#### Server

Create a `server/.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Client

If you want to enable Google AdSense in the web app, create a `client/.env` file:

```env
VITE_ADSENSE_CLIENT_ID=ca-pub-your-publisher-id
VITE_ADSENSE_SLOT_ID=your-slot-id
```

If these values are omitted, the AdSense banner will not render.

### 3. Start the backend

From `server/`:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:3001
```

### 4. Start the frontend

From `client/`:

```bash
npm run dev
```

The Vite app runs on:

```text
http://localhost:5173
```

## Available Scripts

### Client

From `client/`:

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

### Server

From `server/`:

- `npm run dev` — start the server with file watching
- `npm start` — start the server normally

## API

### `POST /api/explain`

Accepts form data with either:

- `text` — a typed homework problem
- `image` — an uploaded homework image

At least one of these fields must be present.

### Example behavior

The server returns structured JSON in this shape:

```json
{
  "subject": "Mathematics",
  "type": "Word Problem",
  "question": "Sarah has 12 apples. She gives away 5 and buys 8 more. How many apples does she have now?",
  "answer": "15",
  "steps": [
    {
      "title": "Start with the apples Sarah has",
      "explanation": "Sarah begins with 12 apples.",
      "how_to_say_it": "Let us begin with what Sarah already has before anything changes."
    }
  ]
}
```

## Design Goals

ClarifyHW is designed to feel calm, simple, and supportive. The product direction emphasizes:

- Clear explanations over academic jargon
- Helpful parenting language over abstract AI output
- Fast input methods for real homework situations
- A trustworthy interface that feels approachable on first use

## Deployment Notes

### Frontend

The frontend is a standard Vite application and can be deployed to platforms such as Netlify, Vercel, or any static hosting provider.

### Backend

The backend requires a Node.js runtime and access to the Gemini API key through environment variables.

### Ads

This project currently supports **Google AdSense for web**. Since the current client is a browser-based React app, **Google AdMob is not applicable unless a native mobile layer is introduced**.

## Future Improvements

- Authentication and saved history
- Better upload validation and image preprocessing
- Persistent explanation storage
- Export or share explanation flow
- Analytics and usage tracking
- Mobile app packaging if native monetization is needed

## Development Notes

- The frontend proxies `/api` requests to `http://localhost:3001` during development.
- The server currently allows the frontend origin at `http://localhost:5173`.
- Explanations are temporarily stored in `sessionStorage` for the result page flow.

## License

This project is currently unlicensed for public reuse. Add a license if you plan to distribute it publicly.
