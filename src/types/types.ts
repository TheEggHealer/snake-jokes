export interface Joke {
  title: string
  date: number
  description: string
  approved_by: UserData[]
  images: string[]
  orientation: number
}

export interface UserData {
  user_name: string
  profile_picture: string
}