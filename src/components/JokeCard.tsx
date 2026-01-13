import { Box, Center, Image, Stack, Text, Title } from "@mantine/core"
import type { Joke } from "../types/types"
import './JokeCard.css'
import { useEffect, useRef, useState } from "react"

interface JokeCardProps {
  joke: Joke
  created: string
}

function JokeCard({ joke, created }: JokeCardProps) {
  const [hover, setHover] = useState<boolean>(false)
  const [titleHeight, setTitleHeight] = useState<number>(0)
  const [descriptionHeight, setDescriptionHeight] = useState<number>(0)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      setTitleHeight(titleRef.current.clientHeight)
    }

    if (descriptionRef.current) {
      setDescriptionHeight(descriptionRef.current.clientHeight)
    }
  })

  return (
    <Box className="joke-card" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Image h='100%' src={joke.img_url} className="joke-card-image" />

      <Box ref={descriptionRef} className="joke-description" bottom={hover ? 0 : `${-descriptionHeight + titleHeight + 20}px`}>
        <Stack gap={20}>
          <Center ref={titleRef} mih={70}>
            <Title order={3} ta="center" c="white">{joke.title}</Title>
          </Center>
            <Text ta="center" c="white">
            {joke.description.length > 200 
              ? `${joke.description.substring(0, 200)}...` 
              : joke.description}
            </Text>
        </Stack>
      </Box>
    </Box>
  )
}

export default JokeCard