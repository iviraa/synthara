# Synthara

Synthara is a powerful research assistant that helps you analyze and understand your research papers. It goes beyond simple search and summaries, providing deep insights and expanding perspectives on your research materials.

## Features

- 📚 PDF document upload and analysis
- 🤖 AI-powered research synthesis
- 📊 Interactive research workspace
- 🔐 Secure authentication with Kinde
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.1.7
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Kinde
- **Database**: NeonDB, Prisma
- **API**: tRPC
- **AI**: OpenAI, LangChain
- **Vector Database**: Pinecone
- **File Upload**: UploadThing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Pinecone API key
- Kinde account
- UploadThing account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/iviraa/synthara.git
cd synthara
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Copy the environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your API keys and configuration.

5. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

6. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# See .env.example for all required variables
```

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
├── db/              # Database configuration
└── trpc/            # tRPC router and procedures
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
