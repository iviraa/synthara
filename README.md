# Synthara

A research assistant that turns your papers and slides into a searchable, conversational knowledge base. Upload a PDF, ask questions in plain language, and get answers with citations pointing back to the exact passages.

## Features

- PDF document upload and analysis
- Conversational Q&A across every document in your workspace
- Citations on every answer, linked to the source page
- Secure authentication with Kinde
- Modern, responsive UI

## How it works

```
PDF → UploadThing → chunk + embed → Pinecone + Postgres → LangChain + OpenAI → cited answer
```

1. You upload a PDF into a workspace
2. UploadThing stores it; a background job chunks every page and generates embeddings
3. Embeddings are written to a Pinecone index; metadata goes into NeonDB via Prisma
4. On each question, LangChain retrieves the top-k relevant chunks and asks OpenAI to answer using them
5. The response comes back with inline citations that link to the source page

## Tech Stack

- **Framework:** Next.js 15, TypeScript
- **API:** tRPC
- **Auth:** Kinde
- **Database:** NeonDB, Prisma
- **AI:** OpenAI, LangChain
- **Vector Database:** Pinecone
- **File Upload:** UploadThing
- **Styling:** Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+
- npm
- An OpenAI API key
- A Pinecone index
- A Kinde account
- An UploadThing account
- A Postgres URL (NeonDB recommended)

### Installation

```bash
git clone https://github.com/iviraa/synthara.git
cd synthara

npm install
cp .env.example .env   # fill in the keys
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/          # Next.js app router
├── components/   # React components
├── lib/          # Shared utilities
├── hooks/        # Custom hooks
├── db/           # Prisma client
└── trpc/         # tRPC router and procedures
```

## License

MIT
