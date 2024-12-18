'use client'

import { useEffect, useRef } from 'react'

interface ARSceneProps {
  currentPosition: GeolocationPosition | null
  selectedPOI: { id: number; name: string; latitude: number; longitude: number } | null
  campusPOIs: Array<{ id: number; name: string; latitude: number; longitude: number }>
}

export default function ARScene({ currentPosition, selectedPOI, campusPOIs }: ARSceneProps) {
  const sceneRef = useRef<HTMLASceneElement>(null)

  useEffect(() => {
    if (currentPosition && sceneRef.current) {
      const camera = sceneRef.current.querySelector('a-camera')
      if (camera) {
        camera.setAttribute('gps-camera', {
          simulateLatitude: currentPosition.coords.latitude,
          simulateLongitude: currentPosition.coords.longitude,
        })
      }
    }
  }, [currentPosition])

  return (
    <a-scene
      ref={sceneRef}
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; debugUIEnabled: false; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;"
      renderer="antialias: true; alpha: true"
      embedded
    >
      <a-camera gps-camera rotation-reader></a-camera>
      
      {campusPOIs.map((poi) => (
        <a-entity
          key={poi.id}
          look-at="[gps-camera]"
          gps-entity-place={`latitude: ${poi.latitude}; longitude: ${poi.longitude};`}
          scale="20 20 20"
        >
          <a-box 
            color={selectedPOI && selectedPOI.id === poi.id ? "red" : "blue"} 
            scale={selectedPOI && selectedPOI.id === poi.id ? "1.5 1.5 1.5" : "1 1 1"}
          ></a-box>
          <a-text 
            value={poi.name} 
            scale="10 10 10" 
            align="center" 
            anchor="center" 
            position="0 1.5 0"
          ></a-text>
        </a-entity>
      ))}
    </a-scene>
  )
}

