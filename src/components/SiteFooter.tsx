import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Mail, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Instant, AI-powered background removal for professionals, designers, and creators. HD transparent PNGs in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI Processing Engine: Operational
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/features" className="hover:text-foreground transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-foreground transition-colors">Workspace</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal & Privacy</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Contact</h4>
            <div className="mt-3 space-y-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground/80 block mb-1">Email</span>
                <a
                  href="mailto:kumarprashant8595@gmail.com"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group break-all"
                >
                  <Mail className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span className="break-all">kumarprashant8595@gmail.com</span>
                </a>
              </div>

              <div>
                <a
                  href="https://www.linkedin.com/in/prashant-kumar-694176274/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="glass inline-flex items-center justify-center h-10 w-10 rounded-full text-foreground/90 hover:text-primary border border-border/60 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1 hover:scale-105 transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} SnapCut AI. All rights reserved.
          </div>
          <div className="font-medium text-foreground/80">
            Developed by <span className="text-gradient-brand font-bold">Prashant Kumar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}