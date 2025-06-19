export interface App {
  id: string
  name: string
  description: string
  image: string
  link: string
  type: 'game' | 'puzzle' | 'productivity' | 'development' | 'tools'
  dateAdded: string
  timesPlayed: number
  minutesPlayed: number
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  isVibeCoded?: boolean
}

export interface AppsData {
  apps: App[]
}
