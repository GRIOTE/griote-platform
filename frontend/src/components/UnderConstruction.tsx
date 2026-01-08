import { Hammer, Clock } from "lucide-react"

interface UnderConstructionProps {
  title?: string
  message?: string
}

export function UnderConstruction({
  title = "En construction",
  message = "Cette section est en cours de développement. Nous lavorons dur pour vous offrir la meilleure expérience possible.",
}: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
      <div className="relative">
        <Hammer className="h-16 w-16 text-griote-accent animate-pulse" />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
          <Clock className="h-6 w-6 text-griote-blue-dark" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-griote-blue-dark">{title}</h3>
      <p className="text-griote-gray-600 max-w-md">{message}</p>
      <div className="flex items-center gap-2 text-sm text-griote-gray-500 mt-4">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        <span>Retournez très bientôt</span>
      </div>
    </div>
  )
}
