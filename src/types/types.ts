export interface Joke {
  title: string
  date: string
  description: string
  approved_by: string[]
  images: string[]
  orientation: number
}

export interface UserData {
  user_name: string
  profile_picture: string
}