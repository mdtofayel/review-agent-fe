import type { PropsWithChildren, ReactNode } from "react";

type PageTemplateProps = PropsWithChildren<{
  sidebar?: ReactNode;
  className?: string;
}>;

export default function PageTemplate({
  children,
  sidebar,
  className = "",
}: PageTemplateProps) {
  return (
    <section
      className={
        "max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-8 " +
        className
      }
    >
      <article className="min-w-0">{children}</article>
      {sidebar && <aside className="min-w-0">{sidebar}</aside>}
    </section>
  );
}
