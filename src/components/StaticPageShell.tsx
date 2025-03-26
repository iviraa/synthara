import WidthWrapper from "./WidthWrapper";

interface StaticPageShellProps {
  eyebrow: string;
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}

const StaticPageShell = ({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: StaticPageShellProps) => {
  return (
    <main className="min-h-screen bg-canvas pb-32 pt-16 sm:pt-24">
      <WidthWrapper className="max-w-3xl">
        <header className="flex flex-col gap-5 border-b border-ink-black/[0.06] pb-12">
          <p className="text-caption uppercase tracking-[0.18em] text-slate">
            {eyebrow}
          </p>
          <h1 className="max-w-[20ch] text-[40px] font-light leading-[1.05] tracking-[-0.04em] text-ink-black sm:text-heading lg:text-heading-lg">
            {title}
          </h1>
          {intro ? (
            <p className="max-w-[60ch] text-body text-graphite sm:text-subheading">
              {intro}
            </p>
          ) : null}
          {updated ? (
            <p className="text-caption text-slate">Last updated {updated}</p>
          ) : null}
        </header>

        <article className="prose-synthara mt-12 flex flex-col gap-10">
          {children}
        </article>
      </WidthWrapper>
    </main>
  );
};

export const Section = ({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-heading-sm font-medium text-ink-black">{heading}</h2>
    <div className="flex flex-col gap-3 text-body leading-[1.6] text-graphite">
      {children}
    </div>
  </section>
);

export default StaticPageShell;
