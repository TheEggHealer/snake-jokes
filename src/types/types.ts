export interface Joke {
  title: string
  date: number
  description: string
  approved_by: UserData[]
  img_url: string
}

export interface UserData {
  user_name: string
  profile_picture: string
}