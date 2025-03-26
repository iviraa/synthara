import StaticPageShell, { Section } from "@/components/StaticPageShell";
import Link from "next/link";

export const metadata = {
  title: "Privacy · Synthara",
  description:
    "How Synthara handles your documents, account data, and the conversations you have with your library.",
};

export default function PrivacyPage() {
  return (
    <StaticPageShell
      eyebrow="Privacy"
      title="Your library is yours."
      intro="This page describes what Synthara collects, why it collects it, and what it never does with it. Plain language, no dark patterns."
    >
      <Section heading="What is collected">
        <p>
          When you sign up, Synthara stores your email address and an account
          identifier from the authentication provider. When you upload a
          document, the file contents and a vector index of its passages are
          stored so questions about it can be answered later. When you ask a
          question, the question and the response are kept so the
          conversation is there when you come back.
        </p>
        <p>
          Standard request metadata is logged for one week to debug outages.
          That log is purged on a rolling basis.
        </p>
      </Section>

      <Section heading="What never happens">
        <p>
          Your documents and conversations are not used to train models.
          They are not sold, licensed, or shared with third parties for
          marketing. They are not used to improve a product that other
          users will benefit from. Your library stays scoped to your
          account.
        </p>
      </Section>

      <Section heading="Who can see your data">
        <p>
          Only you. In the rare case where a debug requires it, you will be
          asked for explicit permission and only the specific record needed
          will be accessed. Every such access is logged.
        </p>
      </Section>

      <Section heading="Subprocessors">
        <p>
          To run Synthara: a managed Postgres host stores account data, a
          managed object store keeps the original file bytes, a vector
          database powers semantic search, and one large language model
          provider handles the answer step. Each is bound by a data
          processing agreement that prohibits training on your data.
        </p>
      </Section>

      <Section heading="Your controls">
        <p>
          You can delete any document, any conversation, or your entire
          account from the Workspace and Library pages. Deletion is
          permanent. The file bytes, the vector index, and the message
          history are purged within seven days.
        </p>
      </Section>

      <Section heading="Questions">
        <p>
          Privacy questions can go to{" "}
          <Link href="mailto:c9ivira@gmail.com" className="link-inline">
            c9ivira@gmail.com
          </Link>
          .
        </p>
      </Section>
    </StaticPageShell>
  );
}
