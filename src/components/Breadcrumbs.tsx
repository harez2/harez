import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  path?: string; // omit on the current (last) crumb
}

interface Props {
  items: Crumb[];
  className?: string;
}

const SITE = "https://harezalbaki.com";

const Breadcrumbs = ({ items, className = "" }: Props) => {
  if (!items?.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.path ? { item: `${SITE}${c.path}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav
        aria-label="Breadcrumb"
        className={`font-body text-sm text-muted-foreground ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((c, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {c.path && !isLast ? (
                  <Link
                    to={c.path}
                    className="hover:text-primary transition-colors"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "text-foreground" : ""}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {c.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;