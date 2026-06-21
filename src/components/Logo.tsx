import logo from "@/assets/snapcut-logo.png.asset.json";
import { Link } from "@tanstack/react-router";

interface LogoProps {
  showText?: boolean;
  size?: number;
  linkTo?: string;
}

export function Logo({ showText = true, size = 32, linkTo = "/" }: LogoProps) {
  const content = (
    <span className="flex items-center gap-2">
      <img
        src={logo.url}
        alt="SnapCut AI"
        width={size}
        height={size}
        className="rounded-md"
      />
      {showText && (
        <span className="text-lg font-bold tracking-tight">
          SnapCut <span className="text-gradient-brand">AI</span>
        </span>
      )}
    </span>
  );
  if (!linkTo) return content;
  return (
    <Link to={linkTo} className="inline-flex items-center">
      {content}
    </Link>
  );
}