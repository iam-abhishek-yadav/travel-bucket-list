"use client"

// Import necessary libraries and components
import React, { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { motion, AnimatePresence } from "framer-motion"
import { Destination } from "@/types"
import ProgressBar from "@/components/ProgressBar"
import AddDestinationForm from "@/components/AddDestinationForm"
import BucketList from "@/components/BucketList"
import Map from "@/components/Map"
import { Moon, Sun } from "lucide-react"

export default function Home() {
	// State to manage destinations, dark mode, and adding destination form visibility
	const [destinations, setDestinations] = useState<Destination[]>([])
	const [darkMode, setDarkMode] = useState<boolean>(false)
	const [isAddingDestination, setIsAddingDestination] = useState<boolean>(false)

	// Load saved destinations from local storage
	useEffect(() => {
		const savedDestinations = localStorage.getItem("travelBucketList")
		if (savedDestinations) {
			setDestinations(JSON.parse(savedDestinations))
		}
	}, [])

	// Save destinations to local storage whenever they change
	useEffect(() => {
		localStorage.setItem("travelBucketList", JSON.stringify(destinations))
	}, [destinations])

	// Toggle dark mode
	const toggleDarkMode = (): void => {
		setDarkMode(!darkMode)
	}

	// Add a new destination
	const addDestination = (newDestination: Destination): void => {
		setDestinations([...destinations, newDestination])
		setIsAddingDestination(false)
	}

	// Remove a destination by ID
	const removeDestination = (id: number): void => {
		setDestinations(destinations.filter((dest) => dest.id !== id))
	}

	// Update a destination's details
	const updateDestination = (
		id: number,
		updates: Partial<Destination>
	): void => {
		setDestinations(
			destinations.map((dest) =>
				dest.id === id ? { ...dest, ...updates } : dest
			)
		)
	}

	// Calculate the completion percentage based on visited destinations
	const completionPercentage: number =
		(destinations.filter((dest) => dest.visited).length / destinations.length) *
			100 || 0

	// Render the component
	return (
		<DndProvider backend={HTML5Backend}>
			<div
				className={`min-h-screen  ${
					darkMode
						? "dark bg-gray-900 text-white"
						: "bg-gradient-to-br from-blue-100 to-purple-100"
				}`}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="container mx-auto px-4 py-8">
					<header className="flex justify-between items-center mb-8">
						<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
							Travel Bucket List
						</h1>
						<button
							onClick={toggleDarkMode}
							className="p-1 bg-white dark:bg-gray-600 rounded-full transition-all duration-300 shadow-lg">
							{darkMode ? <Sun /> : <Moon />}
						</button>
					</header>
					<ProgressBar percentage={completionPercentage} />
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsAddingDestination(!isAddingDestination)}
								className="mb-4 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg">
								{isAddingDestination ? "Cancel" : "✈️ Add New Destination"}
							</motion.button>
							<AnimatePresence>
								{isAddingDestination && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}>
										<AddDestinationForm addDestination={addDestination} />
									</motion.div>
								)}
							</AnimatePresence>
							<BucketList
								destinations={destinations}
								removeDestination={removeDestination}
								updateDestination={updateDestination}
							/>
						</div>
						<React.Suspense fallback={<div>Loading map...</div>}>
							<div className="sticky top-8">
								<Map destinations={destinations} />
							</div>
						</React.Suspense>
					</div>
				</motion.div>
			</div>
		</DndProvider>
	)
}
