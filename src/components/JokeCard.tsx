import { Box, Stack, Image, Title, BackgroundImage } from "@mantine/core"
import type { Joke } from "../types/types"
import './JokeCard.css'

interface JokeCardProps {
  joke: Joke
  created: string
}

function JokeCard({ joke, created }: JokeCardProps) {
  return (
    <Box       className="joke-card">
      <BackgroundImage
        src={joke.img_url}
        radius={20}
        h='100%'
        >
        <Stack h='100%' justify="end">
          <Box>
            <Title>{joke.title}</Title>
          </Box>
        </Stack>
      </BackgroundImage>
    </Box>
  )
}

export default JokeCard