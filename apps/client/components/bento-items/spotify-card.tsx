import { Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { WidgetCard } from "@/lib/content"

interface SpotifyCardProps {
  item: WidgetCard
}

export function SpotifyCard({ item }: SpotifyCardProps) {
  if (item.data.type !== "spotify") return null

  const isLarge = item.data.variant === "large"

  return (
    <div className={cn(
      "flex flex-col justify-between h-full relative overflow-hidden bg-zinc-300 rounded-2xl p-4", // Standardized padding
      "shadow-input border border-transparent group-hover/bento:shadow-xl transition duration-200" // Moved shadow/border here
    )}>
      <div className={cn("absolute animate-pulse", isLarge ? "top-6 right-6" : "top-0 right-0")}>
          <Music className={cn("opacity-50", isLarge ? "w-12 h-12" : "w-6 h-6")} />
      </div>
      <div className="mt-auto">
          <div className={cn(
            "bg-zinc-400 rounded-2xl mb-6 flex items-center justify-center shadow-lg", 
            isLarge ? "w-32 h-32" : "w-12 h-12 rounded-md mb-3"
          )}>
              {/* Placeholder for Album Art if URL fails */}
              <Music className={cn("text-white", isLarge ? "w-16 h-16" : "w-6 h-6")} />
          </div>
          <h3 className={cn("font-bold leading-tight truncate", isLarge ? "text-4xl mb-2" : "text-base")}>
            {item.data.songTitle}
          </h3>
          <p className={cn("opacity-70 truncate", isLarge ? "text-xl" : "text-sm")}>
            {item.data.artist}
          </p>
      </div>
    </div>
  )
}
