# Synthara

A research workspace for your PDFs. Drop in a paper and ask anything.

## How it works

```
PDF -> UploadThing -> Chunk + Embed -> Pinecone + Postgres -> Retrieval <- Question -> LangChain + OpenAI -> Cited Answer
```

1. A PDF is uploaded into a workspace through UploadThing, which stores the file and fires a webhook back to the app
2. The webhook chunks the PDF page-by-page and embeds each chunk with OpenAI's embedding model
3. Embeddings are written to Pinecone under a per-file namespace, file metadata is tracked in Postgres via Prisma
4. Each question runs a similarity search across the workspace's namespaces and pulls the top-k chunks
5. LangChain packs the chunks into a prompt and OpenAI streams the answer back with passage-level citations

## Stack

- **Framework:** Next.js 15 App Router, React 18, TypeScript
- **API:** tRPC, React Query
- **Styling:** Tailwind CSS
- **Auth:** Kinde
- **Database:** Postgres via Prisma
- **Vector store:** Pinecone
- **Uploads:** UploadThing
- **AI:** OpenAI, LangChain

## Project layout

```
src/
├── app/
│   ├── about/
│   ├── privacy/
│   ├── terms/
│   ├── auth-callback/
│   ├── workspace/              # Workspaces grid + detail (PDF + chat)
│   ├── library/                # Cross-workspace file list
│   ├── api/                    # Auth, message, upload, tRPC routes
│   ├── icon.svg
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Landing
├── components/
│   ├── chat/                   # ChatWrapper, Messages, Message, ChatInput
│   ├── ui/
│   ├── Navbar.tsx
│   ├── StaticPageShell.tsx
│   ├── DashboardComponent.tsx  # Library files list
│   ├── WorkspaceComponent.tsx  # Workspaces grid
│   ├── WorkspaceRenderer.tsx   # PDF viewer panel
│   ├── PdfRenderer.tsx
│   └── UploadButton.tsx
├── lib/
├── hooks/
├── db/                         # Prisma client
└── trpc/                       # Router and procedures
```

## Run it

```bash
# 1. Clone the repository and step in
git clone https://github.com/iviraa/synthara.git
cd synthara

# 2. Install dependencies
npm install

# 3. Copy the example env file and fill in your keys
cp .env.example .env

# 4. Generate the Prisma client and push the schema to Postgres
npx prisma generate
npx prisma db push

# 5. Start the dev server on http://localhost:3000
npm run dev
```
