import StaticPageShell, { Section } from "@/components/StaticPageShell";
import Link from "next/link";

export const metadata = {
  title: "Terms · Synthara",
  description:
    "The rules of the road for using Synthara. Short, readable, and intentionally light.",
};

export default function TermsPage() {
  return (
    <StaticPageShell
      eyebrow="Terms"
      title="The rules of the road."
      intro="A short, readable agreement between you and Synthara. By creating an account or using the product, you agree to these terms."
    >
      <Section heading="Your account">
        <p>
          You are responsible for the security of your sign-in credentials.
          Do not share them. If you believe your account has been accessed
          without your permission, get in touch and it will be locked
          quickly.
        </p>
        <p>
          You must be at least sixteen years old to use Synthara. If you are
          using it on behalf of a research group, you confirm that you have
          authority to accept these terms on the group's behalf.
        </p>
      </Section>

      <Section heading="What you upload">
        <p>
          You keep ownership of every document you upload. By using
          Synthara, you grant a narrow, revocable license to store, index,
          and retrieve your documents for the sole purpose of answering
          your questions about them.
        </p>
        <p>
          Do not upload material you do not have the right to use. Content
          that violates copyright will be removed when notified through a
          credible channel.
        </p>
      </Section>

      <Section heading="Acceptable use">
        <p>
          Do not use Synthara to harass other people, to generate misleading
          synthetic content, to circumvent paywalls or bypass licensing
          terms, or to build a competing product by scraping its outputs.
          Reasonable judgment applies.
        </p>
      </Section>

      <Section heading="Service quality">
        <p>
          Synthara is a young product and may occasionally be slow, return
          imperfect answers, or be temporarily unavailable. There is no
          promise of a specific uptime, accuracy rate, or feature roadmap.
        </p>
      </Section>

      <Section heading="Liability">
        <p>
          Synthara is provided as is. To the maximum extent permitted by
          law, no liability is assumed for indirect, incidental, or
          consequential damages arising from your use of the product.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          These terms may be updated as the product evolves. If a change
          materially affects your rights, you will be notified by email at
          least thirty days before it takes effect.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Reach out at{" "}
          <Link href="mailto:c9ivira@gmail.com" className="link-inline">
            c9ivira@gmail.com
          </Link>{" "}
          for any questions about this agreement.
        </p>
      </Section>
    </StaticPageShell>
  );
}
