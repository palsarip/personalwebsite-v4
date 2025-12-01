"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { bentoGridItems, type BentoItem } from "@/lib/content"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/container"

// Import new components
import { ProfileCard } from "@/components/bento-items/profile-card"
import { SocialCard } from "@/components/bento-items/social-card"
import { SheetCard } from "@/components/bento-items/sheet-card"
import { WidgetRenderer } from "@/components/bento-items/widget-renderer"
import { SpotifyCard } from "@/components/bento-items/spotify-card"
import { ExpandedCard } from "@/components/ui/expanded-card"

export default function Home() {
  console.log("Rendering Home with items:", bentoGridItems)
  const [activeSheetId, setActiveSheetId] = useState<number | null>(null)

  const closeSheet = () => setActiveSheetId(null)

  // Helper to get active item data
  const activeItem = activeSheetId ? bentoGridItems.find((item) => item.id === activeSheetId) : null

  // Helper to render card content based on type
  const renderCardContent = (item: BentoItem) => {
    switch (item.type) {
      case "profile":
        return <ProfileCard item={item} />
      case "social":
        return <SocialCard item={item} />
      case "widget":
        if (item.data.type === "spotify") {
            return <SpotifyCard item={item} />
        }
        return <WidgetRenderer item={item} />
      case "sheet":
        return <SheetCard item={item} />
      default:
        return null
    }
  }

  return (
    <div className="font-sans">
      <Container className="space-y-8 py-8">
        {/* ProfileHeader removed as requested */}

        <BentoGrid>
          {bentoGridItems.map((item) => (
            <BentoCard
              key={item.id}
              layoutId={`card-${item.id}`}
              enableHover={item.type === "sheet" && !!item.data.sheetContent}
              className={cn(
                // 1. Layout Config
                item.layout.colSpan === 1 ? "col-span-1" : 
                item.layout.colSpan === 2 ? "col-span-2" : "col-span-3",
                item.layout.rowSpan === 1 ? "row-span-1" : "row-span-2",
                
                // 2. Style Config (Defaults if not provided)
                item.style?.background || "bg-white",
                item.style?.textColor || "text-zinc-900",
                item.style?.borderRadius || "rounded-4xl",
                
                // 3. Explicit Style Variables
                item.style?.overflow === "hidden" && "overflow-hidden",
                item.style?.contentAlignment === "center" && "flex items-center justify-center",
                item.style?.shadow === "none" && "shadow-none",
                item.style?.shadow === "sm" && "shadow-sm",
                item.style?.shadow === "md" && "shadow-md",
                item.style?.shadow === "lg" && "shadow-lg",
                item.style?.shadow === "xl" && "shadow-xl",
                item.style?.shadow === "2xl" && "shadow-2xl",
                item.style?.shadow === "input" && "shadow-input",

                // 4. Spotify Variant Padding Override
                // If it's Spotify and variant is 'default', we remove padding (p-0) so the inner colored box fills the cell (Uniform look).
                // If it's 'large', we keep default padding (or set p-4) for the inset look.
                item.type === "widget" && item.data.type === "spotify" && item.data.variant === "default" && "p-0",
                item.type === "widget" && item.data.type === "spotify" && item.data.variant === "large" && "p-4",
                
                // 5. Remove Shadow/Border from outer card for Spotify (since it's on the inner container now)
                item.type === "widget" && item.data.type === "spotify" && "shadow-none border-none",

                // 6. Profile Circle Variant Overrides
                // If variant is circle, we want transparent background and no shadow on the container
                item.type === "profile" && item.data.variant === "circle" && "bg-transparent shadow-none border-none",

                // 7. Social Media Card Override
                // Social cards need full width for the grid layout, so we remove padding
                item.type === "social" && "p-0",

                // 8. Sheet Card Cover Override
                // If a sheet card has a cover, we remove padding so the image/video is full bleed
                item.type === "sheet" && item.data.cover && "p-0",

                // 9. Tech Stack Widget Override
                // Tech stack needs full width for the infinite scroll
                item.type === "widget" && item.data.type === "tech-stack" && "p-0"
              )}
              onClick={item.type === "sheet" && item.data.sheetContent ? () => setActiveSheetId(item.id) : undefined}
            >
              {renderCardContent(item)}
            </BentoCard>
          ))}
        </BentoGrid>

        <AnimatePresence>
          {activeItem && activeItem.type === "sheet" && (
            <ExpandedCard 
              key={`expanded-${activeItem.id}`}
              item={activeItem} 
              onClose={closeSheet} 
              layoutId={`card-${activeItem.id}`} 
            />
          )}
        </AnimatePresence>
      </Container>
    </div>
  )
}
