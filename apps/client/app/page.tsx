"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { bentoGridItems, type BentoItem } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

// Import new components
import { ProfileCard } from "@/components/bento-items/profile-card";
import { SocialCard } from "@/components/bento-items/social-card";
import { SheetCard } from "@/components/bento-items/sheet-card";
import { WidgetRenderer } from "@/components/bento-items/widget-renderer";
import { SpotifyCard } from "@/components/bento-items/spotify-card";
import { ExpandedCard } from "@/components/ui/expanded-card";

export default function Home() {
  console.log("Rendering Home with items:", bentoGridItems);
  const [activeSheetId, setActiveSheetId] = useState<number | null>(null);

  const closeSheet = () => setActiveSheetId(null);

  // Helper to get active item data
  const activeItem = activeSheetId
    ? bentoGridItems.find((item) => item.id === activeSheetId)
    : null;

  // Helper to render card content based on type
  const renderCardContent = (item: BentoItem) => {
    switch (item.type) {
      case "profile":
        return <ProfileCard item={item} />;
      case "social":
        return <SocialCard item={item} />;
      case "widget":
        if (item.data.type === "spotify") {
          return <SpotifyCard item={item} />;
        }
        return <WidgetRenderer item={item} />;
      case "sheet":
        return <SheetCard item={item} />;
      default:
        return null;
    }
  };

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
              enableTap={
                item.type === "widget" ||
                (item.type === "sheet" &&
                  !!item.data.sheetTitle &&
                  !!item.data.sheetContent)
              }
              label={(item.data as any).label}
              labelPosition={(item.data as any).labelPosition}
              className={cn(
                // 1. Layout Config - Responsive Spans
                "col-span-1", // Mobile: Always 1 column
                item.layout.colSpan >= 2 && "md:col-span-2", // Tablet/Desktop (3-col grid): Span 2 if original is 2
                item.layout.colSpan === 3 && "md:col-span-3", // Tablet/Desktop (3-col grid): Span 3 if original is 3

                // Row Spans - Responsive
                "row-span-1", // Mobile: Default to 1 row height
                item.layout.rowSpan === 2 && "md:row-span-2", // Tablet/Desktop: Allow taller rows

                // 2. Style Config (Defaults if not provided)
                item.style?.background || "bg-white",
                item.style?.textColor || "text-zinc-900",
                item.style?.borderRadius || "rounded-4xl",

                // 3. Explicit Style Variables
                item.style?.overflow === "hidden" && "overflow-hidden",
                item.style?.contentAlignment === "center" &&
                  "flex items-center justify-center",
                item.style?.shadow === "none" && "shadow-none",
                item.style?.shadow === "sm" && "shadow-surround-sm",
                item.style?.shadow === "md" && "shadow-surround-md",
                item.style?.shadow === "lg" && "shadow-surround-lg",
                item.style?.shadow === "xl" && "shadow-surround-xl",
                item.style?.shadow === "2xl" && "shadow-surround-2xl",

                // 4. Spotify Variant Padding Override
                item.type === "widget" &&
                  item.data.type === "spotify" &&
                  item.data.variant === "default" &&
                  "p-0",
                item.type === "widget" &&
                  item.data.type === "spotify" &&
                  item.data.variant === "large" &&
                  "p-4",

                // 5. Mobile Ordering
                // Profile (Photo+Name+Time) -> 1
                item.slug === "profile" && "order-1",
                // Role ("I'm software engineer") -> 2
                item.slug === "intro" && "order-2",
                // Blog -> 3
                item.slug === "clean-blog" && "order-3",
                // Socials -> 4
                item.slug === "socials" && "order-4 mobile-aspect-fix",
                // Reset order on tablet/desktop
                "md:order-0",

                // 6. Remove Shadow/Border from outer card for Spotify
                item.type === "widget" &&
                  item.data.type === "spotify" &&
                  "shadow-none border-none",

                // 7. Profile Circle Variant Overrides
                item.type === "profile" &&
                  item.data.variant === "circle" &&
                  "bg-transparent shadow-none border-none p-0", // Added p-0 to fix double padding and visibility

                // 8. Social Media Card Override
                item.type === "social" && "p-0",

                // 9. Sheet Card Cover Override
                item.type === "sheet" &&
                  item.data.cover &&
                  "p-0 bg-transparent",

                // 10. Tech Stack Widget Override
                item.type === "widget" &&
                  item.data.type === "time-location" &&
                  "hidden md:flex" // Hide on mobile since merged into ProfileCard
              )}
              onClick={
                item.type === "sheet" && item.data.sheetContent
                  ? () => setActiveSheetId(item.id)
                  : undefined
              }
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
  );
}
