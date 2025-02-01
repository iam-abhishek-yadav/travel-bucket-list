import { motion, AnimatePresence } from "framer-motion"
import DestinationItem from "./DestinationItem"
import type { Destination } from "../types"
import { useRef } from "react"

interface BucketListProps {
	destinations: Destination[]
	removeDestination: (id: number) => void
	updateDestination: (id: number, updates: Partial<Destination>) => void
}

export default function BucketList({
	destinations,
	removeDestination,
	updateDestination,
}: BucketListProps) {
	const moveDestination = (dragIndex: number, hoverIndex: number) => {
		console.log("Moving from", dragIndex, "to", hoverIndex)
		const newDestinations = [...destinations]
		const [reorderedItem] = newDestinations.splice(dragIndex, 1)
		newDestinations.splice(hoverIndex, 0, reorderedItem)

		// Update all destinations with their new positions
		newDestinations.forEach((dest, index) => {
			updateDestination(dest.id, {
				...dest,
				order: index,
			})
		})
	}

	return (
		<motion.div
			className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}>
			<AnimatePresence mode="popLayout">
				{[...destinations]
					.sort((a, b) => a.order - b.order)
					.map((dest, index) => (
						<DestinationItem
							key={dest.id}
							index={index}
							destination={dest}
							removeDestination={removeDestination}
							updateDestination={updateDestination}
							moveDestination={moveDestination}
						/>
					))}
			</AnimatePresence>
		</motion.div>
	)
}
