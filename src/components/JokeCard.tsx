import { Box, Stack, Text, Title, BackgroundImage } from "@mantine/core"
import type { Joke } from "../types/types"
import './JokeCard.css'

interface JokeCardProps {
  joke: Joke
  created: string
}

function JokeCard({ joke, created }: JokeCardProps) {
  return (
    <Box className="joke-card">
      <BackgroundImage
        className="joke-card-image"
        src={joke.img_url}
        h='100%'
        >
        <Stack h='100%' justify="end">
          <Box className="joke-description">
            <Title order={3} ta="center" c="white">{joke.title}</Title>
            {/* <Text ta="center" c="white">{joke.description}</Text> */}
          </Box>
        </Stack>
      </BackgroundImage>
    </Box>
  )
}

export default JokeCard