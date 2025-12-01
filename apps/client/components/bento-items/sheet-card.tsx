import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { SheetCard as SheetCardType } from "@/lib/content"

interface SheetCardProps {
  item: SheetCardType
}

export function SheetCard({ item }: SheetCardProps) {
  const alignment = item.data.alignment || "bottom-left"
  const hasCover = !!item.data.cover
  if (hasCover) console.log("SheetCard has cover:", item.data.cover)
  // Force center if cover exists, otherwise use config
  const isCenter = hasCover || alignment === "center" || item.style?.contentAlignment === "center"

  return (
    <div className={cn(
      "flex flex-col h-full w-full relative z-10", // Added w-full to ensure it fills parent even if parent has items-center
      isCenter ? "justify-center items-center text-center" : "justify-end items-start text-left"
    )}>
      {/* Cover Image/Video Background */}
      {hasCover && item.data.cover && (
        <>
          {item.data.cover.type === "video" ? (
             <video 
               src={item.data.cover.url}
               autoPlay muted loop playsInline
               className="absolute inset-0 z-[-2] w-full h-full object-cover"
             />
          ) : (
            <div 
              className="absolute inset-0 z-[-2] bg-cover bg-center"
              style={{ backgroundImage: `url(${item.data.cover.url})` }}
            />
          )}
          {/* Dark Overlay for readability - Only if there is text content */}
          {(item.data.title || item.data.description) && (
            <div className="absolute inset-0 z-[-1] bg-black/50" />
          )}
        </>
      )}
      {/* Type guards for sheet item data */}
      {item.data.content && (
         <div className="text-4xl font-bold mb-2">{item.data.content}</div>
      )}
      {item.data.title && (
        <motion.h3 
          layoutId={`title-${item.id}`}
          className="text-xl font-bold mb-2"
        >
          {item.data.title}
        </motion.h3>
      )}
      {item.data.description && (
        <motion.p 
          layoutId={`description-${item.id}`}
          className="text-sm opacity-80"
        >
          {item.data.description}
        </motion.p>
      )}
      {/* Phantom source for content expansion */}
      <motion.div 
        layoutId={`content-${item.id}`}
        className="h-0 w-full opacity-0"
      />
    </div>
  )
}
