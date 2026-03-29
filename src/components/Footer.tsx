import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/methodology", label: "Methodology" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto text-center">
        <nav aria-label="Footer navigation" className="flex items-center justify-center gap-4 text-sm text-text-muted">
          {FOOTER_LINKS.map((link, index) => (
            <span key={link.href} className="flex items-center gap-4">
              {index > 0 && (
                <span aria-hidden="true" className="text-border-subtle">
                  &middot;
                </span>
              )}
              <Link
                href={link.href}
                className="hover:text-accent-periwinkle transition-colors duration-200"
              >
                {link.label}
              </Link>
            </span>
          ))}
          <span aria-hidden="true" className="text-border-subtle">
            &middot;
          </span>
          <a
            href="https://github.com/yrunhaar/howpoorami"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-periwinkle transition-colors duration-200"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
