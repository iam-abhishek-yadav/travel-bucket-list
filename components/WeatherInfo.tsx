import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { WeatherData } from "../types"

interface WeatherInfoProps {
	location: string
}

export default function WeatherInfo({ location }: WeatherInfoProps) {
	const [weather, setWeather] = useState<WeatherData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const fetchWeather = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=API_KEY&units=metric`
				)
				if (!response.ok) {
					setError("Failed to fetch weather data")
					return
				}
				const data: WeatherData = await response.json()
				setWeather(data)
			} catch (error) {
				console.error("Error fetching weather data:", error)
				setError("Unable to fetch weather data")
			} finally {
				setLoading(false)
			}
		}

		fetchWeather()
	}, [location])

	if (loading) {
		return (
			<motion.div
				className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}>
				<p>Loading weather data...</p>
			</motion.div>
		)
	}

	if (error) {
		return (
			<motion.div
				className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}>
				<p className="text-red-500">{error}</p>
			</motion.div>
		)
	}

	if (
		!weather ||
		!weather.main ||
		!weather.weather ||
		weather.weather.length === 0
	) {
		return (
			<motion.div
				className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}>
				<p>No weather data available</p>
			</motion.div>
		)
	}

	return (
		<motion.div
			className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}>
			<h4 className="font-semibold mb-2">Current Weather:</h4>
			<div className="flex items-center space-x-4">
				<img
					src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
					alt={weather.weather[0].description}
					className="w-12 h-12"
				/>
				<div>
					<p className="text-2xl font-bold">{weather.main.temp.toFixed(1)}°C</p>
					<p className="text-gray-600 dark:text-gray-300 capitalize">
						{weather.weather[0].description}
					</p>
				</div>
			</div>
		</motion.div>
	)
}
