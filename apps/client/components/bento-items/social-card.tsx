import Link from "next/link";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialCard as SocialCardType } from "@/lib/content";

interface SocialCardProps {
  item: SocialCardType;
}

export function SocialCard({ item }: SocialCardProps) {
  const variant = item.data.variant || "default";

  const getButtonStyles = (platform: string) => {
    const baseStyles =
      "flex items-center justify-center transition-all duration-300";

    // Platform specific colors for hover states
    const hoverColors: Record<string, string> = {
      github: "hover:bg-[#333] hover:text-white hover:border-[#333]",
      linkedin: "hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]",
      twitter: "hover:bg-[#1da1f2] hover:text-white hover:border-[#1da1f2]",
      instagram: "hover:bg-[#e1306c] hover:text-white hover:border-[#e1306c]",
    };

    switch (variant) {
      case "glass":
        return cn(
          baseStyles,
          "bg-black/5 dark:bg-white/10 backdrop-blur-sm",
          "rounded-2xl", // Squircle
          "text-zinc-700 dark:text-zinc-200",
          hoverColors[platform]
        );
      case "outline":
        return cn(
          baseStyles,
          "bg-transparent border border-zinc-200 dark:border-zinc-700",
          "rounded-full",
          "text-zinc-600 dark:text-zinc-400",
          hoverColors[platform]
        );
      case "default":
      default:
        return cn(
          baseStyles,
          "bg-white",
          "rounded-full",
          "text-zinc-900",
          "shadow-surround-lg", // Updated to match sheet card shadow exactly
          "hover:bg-zinc-50 hover:scale-105"
        );
    }
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full p-4">
      {item.data.links.map((social) => (
        <Link
          key={social.platform}
          href={social.url}
          target="_blank"
          className={getButtonStyles(social.platform)}
        >
          {social.platform === "github" && <Github className="w-6 h-6" />}
          {social.platform === "linkedin" && <Linkedin className="w-6 h-6" />}
          {social.platform === "twitter" && <Twitter className="w-6 h-6" />}
          {social.platform === "instagram" && <Instagram className="w-6 h-6" />}
        </Link>
      ))}
    </div>
  );
}
