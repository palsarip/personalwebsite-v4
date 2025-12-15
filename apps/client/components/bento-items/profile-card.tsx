import {
  ProfileCard as ProfileCardType,
  profileData,
  bentoGridItems,
} from "@/lib/content";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ProfileCardProps {
  item: ProfileCardType;
}

export function ProfileCard({ item }: ProfileCardProps) {
  const isCircle = item.data.variant === "circle";

  // Clock Logic (Simplified for Profile Card)
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Jakarta", // Hardcoded per user context or reuse prop if available
    }).format(date);
  };

  // Check if clock widget exists in configuration
  const hasClockWidget = bentoGridItems.some(
    (item) => item.type === "widget" && item.data.type === "time-location"
  );

  return (
    <div className="relative w-full h-full group">
      {/* Mobile Layout: Photo Left, Info Right */}
      <div className="flex md:hidden w-full h-full items-center p-0 gap-4">
        {/* Photo - Larger on mobile (h-24 w-24) */}
        <div className="relative h-24 w-24 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.data.avatar}
            alt={profileData.name}
            className="w-full h-full object-cover rounded-full shadow-md"
          />
        </div>

        {/* Info - Name & Time */}
        <div className="flex flex-col justify-center min-w-0 z-10">
          <h2 className="text-2xl font-bold text-zinc-900 leading-tight truncate pr-2">
            {profileData?.name || "Naufal Syarif"}
          </h2>
          {/* Conditional Clock Visibility */}
          {hasClockWidget && time && (
            <p className="text-base font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              {formatTime(time)}
            </p>
          )}
        </div>
      </div>

      {/* Desktop/Tablet Layout: Original Centered/Full */}
      <div
        className={cn(
          "hidden md:flex absolute inset-0 w-full h-full items-center justify-center",
          isCircle ? "p-4" : "p-0"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.data.avatar}
          alt={profileData.name}
          className={cn(
            "object-cover",
            isCircle
              ? "h-full w-auto aspect-square rounded-full"
              : "w-full h-full"
          )}
        />
      </div>
    </div>
  );
}
