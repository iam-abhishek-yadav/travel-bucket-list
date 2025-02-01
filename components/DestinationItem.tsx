import { useState, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { motion } from "framer-motion"
import WeatherInfo from "./WeatherInfo"
import type { Destination } from "../types"

interface DestinationItemProps {
	destination: Destination
	index: number
	removeDestination: (id: number) => void
	updateDestination: (id: number, updates: Partial<Destination>) => void
	moveDestination: (dragIndex: number, hoverIndex: number) => void
}

export default function DestinationItem({
	destination,
	index,
	removeDestination,
	updateDestination,
	moveDestination,
}: DestinationItemProps) {
	const [isExpanded, setIsExpanded] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null)

	const [{ isDragging }, drag] = useDrag({
		type: "destination",
		item: { id: destination.id, index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const [{ handlerId }, drop] = useDrop({
		accept: "destination",
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			}
		},
		hover(item: any, monitor) {
			if (!ref.current) {
				return
			}
			const dragIndex = item.index
			const hoverIndex = index

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect()

			// Get vertical middle
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

			// Determine mouse position
			const clientOffset = monitor.getClientOffset()

			// Get pixels to the top
			const hoverClientY = clientOffset!.y - hoverBoundingRect.top

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return
			}

			// Time to actually perform the action
			moveDestination(dragIndex, hoverIndex)

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex
		},
	})

	drag(drop(ref))

	const toggleVisited = (): void => {
		updateDestination(destination.id, { visited: !destination.visited })
	}

	return (
		<motion.div
			ref={ref}
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			data-handler-id={handlerId}
			className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${
				isDragging ? "opacity-50" : ""
			} ${destination.visited ? "border-l-4 border-green-500" : ""}`}>
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-semibold">{destination.name}</h3>
				<div className="flex space-x-2">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="text-blue-500 hover:text-blue-600 transition-colors">
						{isExpanded ? "🔼 Less" : "🔽 More"}
					</button>
					<button
						onClick={() => removeDestination(destination.id)}
						className="text-red-500 hover:text-red-600 transition-colors">
						🗑️ Remove
					</button>
				</div>
			</div>
			<motion.div
				initial={false}
				animate={{
					height: isExpanded ? "auto" : 0,
					opacity: isExpanded ? 1 : 0,
				}}
				transition={{ duration: 0.3 }}
				className="overflow-hidden">
				{isExpanded && (
					<div className="mt-4 space-y-4">
						<img
							src={destination.image || "/placeholder.svg"}
							alt={destination.name}
							className="w-full h-96 object-cover rounded-lg"
						/>
						<p className="text-gray-600 dark:text-gray-300">
							{destination.notes}
						</p>
						<WeatherInfo location={destination.name} />
						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={destination.visited}
								onChange={toggleVisited}
								className="form-checkbox h-5 w-5 text-blue-600"
							/>
							<span>Visited</span>
						</label>
					</div>
				)}
			</motion.div>
		</motion.div>
	)
}
