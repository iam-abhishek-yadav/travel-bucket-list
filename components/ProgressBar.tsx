import { motion } from "framer-motion"

interface ProgressBarProps {
	percentage: number
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
	return (
		<div className="mb-8">
			<div className="flex justify-between items-center mb-2">
				<span className="text-sm font-bold text-gray-600 dark:text-gray-300">
					Progress
				</span>
				<span className="text-sm font-medium text-gray-900 dark:text-gray-300">
					{percentage.toFixed(0)}%
				</span>
			</div>

			<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
				<motion.div
					className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 0.5 }}
				/>
			</div>
		</div>
	)
}
