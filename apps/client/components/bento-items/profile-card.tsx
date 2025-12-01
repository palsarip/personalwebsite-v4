import { ProfileCard as ProfileCardType, profileData } from "@/lib/content"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
  item: ProfileCardType
}

export function ProfileCard({ item }: ProfileCardProps) {
  const isCircle = item.data.variant === "circle"

  return (
    <div className={cn(
      "absolute inset-0 w-full h-full flex items-center justify-center",
      isCircle ? "p-4" : "p-0"
    )}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={item.data.avatar} 
        alt={profileData.name} 
        className={cn(
          "object-cover",
          isCircle ? "h-full w-auto aspect-square rounded-full" : "w-full h-full"
        )}
      />
    </div>
  )
}
