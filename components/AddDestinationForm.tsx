import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import type { Destination } from "../types"

interface AddDestinationFormProps {
	addDestination: (destination: Destination) => void
}

export default function AddDestinationForm({
	addDestination,
}: AddDestinationFormProps) {
	const [name, setName] = useState<string>("")
	const [image, setImage] = useState<string>("")
	const [notes, setNotes] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>("")

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (name && image) {
			setLoading(true)
			setError("")
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
						name
					)}`
				)
				const data = await response.json()

				if (data && data.length > 0) {
					const { lat, lon } = data[0]
					addDestination({
						id: Date.now(),
						name,
						image,
						notes,
						visited: false,
						lat: Number.parseFloat(lat),
						lng: Number.parseFloat(lon),
						order: 0,
					})
					setName("")
					setImage("")
					setNotes("")
				} else {
					setError("Could not find location. Please try a different name.")
				}
			} catch (error) {
				console.error("Error geocoding destination:", error)
				setError(
					"An error occurred while adding the destination. Please try again."
				)
			} finally {
				setLoading(false)
			}
		}
	}

	return (
		<motion.form
			onSubmit={handleSubmit}
			className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}>
			<div className="space-y-4">
				<input
					type="text"
					placeholder="Destination Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					required
				/>
				<input
					type="url"
					placeholder="Image URL"
					value={image}
					onChange={(e) => setImage(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					required
				/>
				<textarea
					placeholder="Notes"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					rows={3}
				/>
				<motion.button
					type="submit"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="w-full p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md">
					Add Destination
				</motion.button>
			</div>
		</motion.form>
	)
}
