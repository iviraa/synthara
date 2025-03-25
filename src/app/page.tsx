import WidthWrapper from "@/components/WidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <main className="bg-canvas">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pb-24 pt-24 sm:pt-32">
        <WidthWrapper className="flex flex-col items-center text-center">
          <Link
            href="#how-it-works"
            className="soft-fill inline-flex items-center gap-2 px-6 py-2 text-body-sm"
          >
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            Read the way you think
          </Link>

          <h1 className="mt-8 max-w-[14ch] text-[42px] font-light leading-[1.05] tracking-[-0.04em] text-ink-black sm:text-[64px] lg:text-display">
            Let your <em className="not-italic font-light">research</em>
            <br />
            talk back to you.
          </h1>

          <p className="mt-6 max-w-[44ch] text-body text-graphite sm:text-subheading">
            Beyond search. Beyond summaries. Synthara synthesizes papers,
            expands perspectives, and unlocks the depths of discovery, one
            question at a time.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            {isUserAuthenticated ? (
              <Link
                className={cn(buttonVariants({ size: "lg" }), "min-w-[180px]")}
                href="/workspace"
              >
                Open workspace
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            ) : (
              <LoginLink
                className={cn(buttonVariants({ size: "lg" }), "min-w-[180px]")}
              >
                Get Synthara
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </LoginLink>
            )}

            <Link
              href="#how-it-works"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              See how it works
            </Link>
          </div>
        </WidthWrapper>

        {/* Ambient spectrum glow + hero mockup */}
        <div className="relative mx-auto mt-20 max-w-page px-6">
          <div
            aria-hidden
            className="spectrum-glow pointer-events-none absolute -inset-x-32 -top-24 -z-10 h-[760px] rounded-[40%]"
          />
          <div className="frost-card relative overflow-hidden p-2 sm:p-3">
            <Image
              src="/landing-hero.jpeg"
              alt="Synthara workspace preview"
              width={1920}
              height={1200}
              quality={100}
              priority
              className="rounded-image w-full"
            />
          </div>
        </div>
      </section>

      {/* ── Spectrum strip ───────────────────────────────────── */}
      <section className="mx-auto max-w-page px-6">
        <div
          aria-hidden
          className="h-px w-full bg-spectrum opacity-80"
        />
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 sm:py-32">
        <WidthWrapper>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-body-sm uppercase tracking-[0.18em] text-slate">
              How it works
            </p>
            <h2 className="mt-4 text-[36px] font-light leading-[1.1] tracking-[-0.04em] text-ink-black sm:text-heading lg:text-heading-lg">
              Three steps from PDF
              <br />
              to a paper that answers back.
            </h2>
            <p className="mt-5 text-body text-graphite">
              No prompt engineering. No manual citations. Just upload and ask.
            </p>
          </div>

          <ol className="mx-auto mt-16 grid max-w-page gap-5 md:grid-cols-3">
            <FeatureCard
              step="01"
              title="Sign in, instantly."
              body="Start free with no card required. Your first workspace takes less than a minute to spin up."
            />
            <FeatureCard
              step="02"
              title="Upload your library."
              body="Drop in PDFs, preprints, or whole reading lists. Synthara indexes them with semantic embeddings in seconds."
            />
            <FeatureCard
              step="03"
              title="Ask anything, in plain English."
              body="Synthara stitches answers across the corpus, with passage-level citations you can audit one click away."
            />
          </ol>

          {/* Secondary product preview */}
          <div className="relative mx-auto mt-24 max-w-page">
            <div
              aria-hidden
              className="spectrum-glow pointer-events-none absolute -inset-x-24 -top-16 -z-10 h-[600px] rounded-[40%]"
            />
            <div className="frost-card overflow-hidden p-2 sm:p-3">
              <Image
                src="/landing-preview.jpeg"
                alt="A Synthara workspace in use"
                width={1920}
                height={1200}
                quality={100}
                className="rounded-image w-full"
              />
            </div>
          </div>
        </WidthWrapper>
      </section>

      {/* ── Privacy / trust ──────────────────────────────────── */}
      <section className="py-28 sm:py-32">
        <WidthWrapper className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-ink-black/[0.04]">
            <Lock className="size-5 text-ink-black" strokeWidth={1.5} />
          </span>
          <h2 className="mt-8 max-w-[18ch] text-[36px] font-light leading-[1.1] tracking-[-0.04em] sm:text-heading lg:text-heading-lg">
            Your research stays yours.
          </h2>
          <p className="mt-5 max-w-[52ch] text-body text-graphite sm:text-subheading">
            Documents are encrypted at rest, never used for training, and
            scoped to your workspace alone.{" "}
            <Link href="/privacy" className="link-inline">
              Learn more about privacy in Synthara
            </Link>
            .
          </p>
        </WidthWrapper>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-ink-black/[0.06] bg-fog/60 py-16">
        <WidthWrapper>
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
            <div className="flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="block size-3 rotate-45 rounded-[2px] bg-spectrum"
                />
                <span className="text-body-sm font-medium">synthara</span>
              </Link>
              <p className="max-w-[36ch] text-body-sm text-graphite">
                Research synthesis, refracted through your own library.
              </p>
            </div>
            <FooterColumn
              heading="Product"
              links={[
                { label: "Workspace", href: "/workspace" },
                { label: "Library", href: "/library" },
              ]}
            />
            <FooterColumn
              heading="Company"
              links={[
                { label: "About", href: "/about" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ]}
            />
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-ink-black/[0.06] pt-6 text-caption text-slate sm:flex-row sm:items-center sm:justify-between">
            <span>Synthara@2026</span>
          </div>
        </WidthWrapper>
      </footer>
    </main>
  );
}

/* ── Local components ───────────────────────────────────── */

function FeatureCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <li className="frost-card flex flex-col gap-4 p-8">
      <span className="text-caption uppercase tracking-[0.18em] text-slate">
        Step {step}
      </span>
      <h3 className="text-heading-sm font-medium text-ink-black">{title}</h3>
      <p className="text-body text-graphite">{body}</p>
    </li>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-body-sm font-medium text-ink-black">{heading}</h4>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body-sm text-graphite transition-colors duration-200 hover:text-ink-black"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
