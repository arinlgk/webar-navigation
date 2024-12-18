'use client'

import { useEffect, useState, useRef } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass, Navigation2, AlertTriangle, MapPin } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import ARScene from './components/ARScene'
import DirectionsPanel from './components/DirectionsPanel'
import { calculateDistance, calculateBearing } from '../utils/geoUtils'

// Simulated campus POIs - replace with actual data
const campusPOIs = [
  { id: 1, name: "Main Building", latitude: 3.0738, longitude: 101.5183 },
  { id: 2, name: "Library", latitude: 3.0740, longitude: 101.5185 },
  { id: 3, name: "Cafeteria", latitude: 3.0735, longitude: 101.5180 },
]

export default function ARNavigation() {
  const [deviceSupport, setDeviceSupport] = useState({
    hasGPS: false,
    hasAccelerometer: false,
    hasMagnetometer: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)
  const [selectedPOI, setSelectedPOI] = useState<typeof campusPOIs[0] | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [bearing, setBearing] = useState<number | null>(null)
  const watchId = useRef<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    checkDeviceSupport()
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current)
    }
  }, [])

  useEffect(() => {
    if (currentPosition && selectedPOI) {
      const dist = calculateDistance(
        currentPosition.coords.latitude,
        currentPosition.coords.longitude,
        selectedPOI.latitude,
        selectedPOI.longitude
      )
      setDistance(dist)

      const bear = calculateBearing(
        currentPosition.coords.latitude,
        currentPosition.coords.longitude,
        selectedPOI.latitude,
        selectedPOI.longitude
      )
      setBearing(bear)
    }
  }, [currentPosition, selectedPOI])

  const checkDeviceSupport = async () => {
    try {
      const hasGPS = 'geolocation' in navigator
      const hasMotionSensors = 'DeviceOrientationEvent' in window && 'DeviceMotionEvent' in window

      setDeviceSupport({
        hasGPS,
        hasAccelerometer: hasMotionSensors,
        hasMagnetometer: hasMotionSensors,
      })
    } catch (err) {
      setError('Error checking device capabilities')
    }
  }

  const startAR = async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission !== 'granted') {
          throw new Error('Permission not granted')
        }
      }

      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition(position)
        },
        (err) => {
          setError(`Error getting location: ${err.message}`)
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      )

      setIsStarted(true)
    } catch (err) {
      setError('Failed to start AR. Please ensure you have granted necessary permissions.')
    }
  }

  const selectPOI = (poi: typeof campusPOIs[0]) => {
    setSelectedPOI(poi)
    toast({
      title: "Destination set",
      description: `Navigating to ${poi.name}`,
    })
  }

  if (isStarted) {
    return (
      <div className="h-screen w-screen relative">
        <ARScene 
          currentPosition={currentPosition} 
          selectedPOI={selectedPOI}
          campusPOIs={campusPOIs}
        />
        <DirectionsPanel 
          selectedPOI={selectedPOI}
          distance={distance}
          bearing={bearing}
        />
        <Button 
          className="fixed top-4 right-4 z-50"
          variant="secondary"
          onClick={() => setIsStarted(false)}
        >
          Exit AR
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AR Campus Navigation</CardTitle>
          <CardDescription>
            Experience interactive navigation using augmented reality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Device Compatibility Check</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Navigation2 className={deviceSupport.hasGPS ? "text-green-500" : "text-red-500"} />
                <span>GPS: {deviceSupport.hasGPS ? "Available" : "Not Available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className={deviceSupport.hasAccelerometer ? "text-green-500" : "text-red-500"} />
                <span>Motion Sensors: {deviceSupport.hasAccelerometer ? "Available" : "Not Available"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Destination</h3>
            <div className="space-y-2">
              {campusPOIs.map((poi) => (
                <Button 
                  key={poi.id} 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => selectPOI(poi)}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {poi.name}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={startAR}
            disabled={!deviceSupport.hasGPS || !deviceSupport.hasAccelerometer || !selectedPOI}
          >
            Start AR Navigation
          </Button>

          {(!deviceSupport.hasGPS || !deviceSupport.hasAccelerometer) && (
            <Alert>
              <AlertTitle>Device Compatibility Issue</AlertTitle>
              <AlertDescription>
                Your device must have GPS and motion sensors to use AR navigation.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

