import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Destination } from "../types"

interface MapProps {
	destinations: Destination[]
}

export default function Map({ destinations }: MapProps) {
	const mapRef = useRef<L.Map | null>(null)
	const markersRef = useRef<{ [key: number]: L.Marker }>({})

	useEffect(() => {
		if (!mapRef.current) {
			mapRef.current = L.map("map").setView([20, 0], 2)
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(mapRef.current)
		}

		const map = mapRef.current

		// Update markers
		destinations.forEach((dest) => {
			if (dest.lat && dest.lng) {
				if (markersRef.current[dest.id]) {
					// Update existing marker
					markersRef.current[dest.id].setLatLng([dest.lat, dest.lng])
				} else {
					// Create new marker
					const icon = L.divIcon({
						className: "custom-div-icon",
						html: `<div class='marker-pin'></div><i class='material-icons'>${
							dest.visited ? "✅" : "📍"
						}</i>`,
						iconSize: [30, 42],
						iconAnchor: [15, 42],
					})

					const marker = L.marker([dest.lat, dest.lng], { icon })
						.addTo(map)
						.bindPopup(dest.name)

					markersRef.current[dest.id] = marker
				}
			}
		})

		// Remove markers for deleted destinations
		Object.keys(markersRef.current).forEach((id) => {
			if (!destinations.find((dest) => dest.id === Number.parseInt(id))) {
				map.removeLayer(markersRef.current[Number.parseInt(id)])
				delete markersRef.current[Number.parseInt(id)]
			}
		})

		// Focus on the last added destination
		if (destinations.length > 0) {
			const lastDest = destinations[destinations.length - 1]
			if (lastDest.lat && lastDest.lng) {
				map.setView([lastDest.lat, lastDest.lng], 10)
			}
		}
	}, [destinations])

	return (
		<div className="relative">
			<div
				id="map"
				className="h-[600px] w-full rounded-lg shadow-lg"
			/>
			<div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md">
				<div className="flex items-center space-x-2">
					<span className="text-red-500">📍</span>
					<span>Not visited</span>
				</div>
				<div className="flex items-center space-x-2">
					<span className="text-green-500">✅</span>
					<span>Visited</span>
				</div>
			</div>
		</div>
	)
}
