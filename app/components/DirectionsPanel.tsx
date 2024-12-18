import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Navigation } from 'lucide-react'

interface DirectionsPanelProps {
  selectedPOI: { id: number; name: string; latitude: number; longitude: number } | null
  distance: number | null
  bearing: number | null
}

export default function DirectionsPanel({ selectedPOI, distance, bearing }: DirectionsPanelProps) {
  if (!selectedPOI || distance === null || bearing === null) return null

  const formatDistance = (dist: number) => {
    return dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(2)} km`
  }

  const getDirection = (angle: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return directions[Math.round(angle / 45) % 8]
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-background/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Directions to {selectedPOI.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Distance: {formatDistance(distance)}</span>
          <span className="text-sm font-medium">Direction: {getDirection(bearing)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5" style={{ transform: `rotate(${bearing}deg)` }} />
          <Progress value={100 - (distance / 10)} className="flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}

