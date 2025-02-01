export interface Destination {
	id: number
	name: string
	image: string
	notes: string
	visited: boolean
	lat: number
	lng: number
	order: number
}

export interface WeatherData {
	main: {
		temp: number
	}
	weather: Array<{
		description: string
		icon: string
	}>
}
