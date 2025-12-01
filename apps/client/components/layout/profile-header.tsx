import { User } from "lucide-react"

interface ProfileHeaderProps {
  name: string
  role: string
  avatar: string
}

export function ProfileHeader({ name, role, avatar }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-muted">
        <div className="w-full h-full bg-zinc-300 flex items-center justify-center text-white">
            <User className="w-8 h-8" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold font-sans">{name}</h1>
        <p className="text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}
