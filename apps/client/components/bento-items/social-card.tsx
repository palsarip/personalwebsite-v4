import Link from "next/link"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"
import { SocialCard as SocialCardType } from "@/lib/content"

interface SocialCardProps {
  item: SocialCardType
}

export function SocialCard({ item }: SocialCardProps) {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full">
      {item.data.links.map((social) => (
        <Link
          key={social.platform}
          href={social.url}
          target="_blank"
          className={cn(
            "flex items-center justify-center transition-colors",
            // Inherit styles from parent or define specific ones for buttons
            "bg-zinc-300 text-white hover:bg-zinc-400", 
            "rounded-4xl" // Default radius for buttons
          )}
        >
          {social.platform === "github" && <Github className="w-6 h-6" />}
          {social.platform === "linkedin" && <Linkedin className="w-6 h-6" />}
          {social.platform === "twitter" && <Twitter className="w-6 h-6" />}
          {social.platform === "instagram" && <Instagram className="w-6 h-6" />}
        </Link>
      ))}
    </div>
  )
}
