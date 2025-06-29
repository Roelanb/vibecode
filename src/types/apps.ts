export interface App {
  id: string
  name: string
  description: string
  image: string
  link: string
  type: 'game' | 'puzzle' | 'productivity' | 'development' | 'tools'
  dateAdded: string
  timesPlayed?: number
  minutesPlayed?: number
  timesUsed?: number
  timesDownloaded?: number
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  isVibeCoded?: boolean
  dateCreated?: string
  llmUsed?: string
}

export interface AppsData {
  apps: App[]
}
