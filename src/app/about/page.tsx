import StaticPageShell, { Section } from "@/components/StaticPageShell";
import Link from "next/link";

export const metadata = {
  title: "About · Synthara",
  description:
    "Synthara is a research tool for people who actually read papers.",
};

export default function AboutPage() {
  return (
    <StaticPageShell
      eyebrow="About"
      title="A reading tool, made for people who still read."
      intro="Synthara grew out of frustration with search bars that summarize and chatbots that hallucinate. The goal is something quieter, something that respects the corpus you have already built."
    >
      <Section heading="What we are building">
        <p>
          Synthara is a workspace for the documents you read closely. You drop
          in PDFs, preprints, slide decks, or saved articles. Synthara indexes
          them locally to your account and lets you ask questions across the
          whole library, with passage-level citations that point straight
          back to the source.
        </p>
        <p>
          We do not believe every search needs to be conversational, and we do
          not believe every conversation needs to be a chat. The interface
          tries to disappear when you are reading and reappear when you have a
          question.
        </p>
      </Section>

      <Section heading="What we will not do">
        <p>
          We will not train on your documents. We will not surface them to
          other users. We will not build a feed, a social layer, or
          notifications you did not ask for. The goal is one good reading
          tool, not a platform.
        </p>
      </Section>

      <Section heading="Get in touch">
        <p>
          For feedback, questions, or anything else, write to{" "}
          <Link href="mailto:c9ivira@gmail.com" className="link-inline">
            c9ivira@gmail.com
          </Link>
          .
        </p>
      </Section>
    </StaticPageShell>
  );
}
