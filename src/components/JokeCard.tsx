import { Box, Center, Image, Stack, Text, Title } from "@mantine/core"
import type { Joke } from "../types/types"
import './JokeCard.css'
import { useEffect, useRef, useState } from "react"

interface JokeCardProps {
  joke: Joke
  created: string
  seed?: number
}

function JokeCard({ joke, created, seed }: JokeCardProps) {

  const hash = parseInt((created + seed).replace(/\D/g, ''), 10)
  const rot = (hash % 4) - 2

  return (
    <Box className="joke-card-root" style={{ rotate: `${rot}deg` }}>
      <Stack>
        <Image src={joke.img_url} bdrs={5}/>
        <Stack p={5} gap={10}>
          <Title order={3}>{joke.title}</Title>
          <Text>{created}</Text>
          <Text>{joke.description}</Text>
        </Stack>
      </Stack>
    </Box>
  )
}

export default JokeCard