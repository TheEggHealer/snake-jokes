import { Box, Group, Stack, Title, Text, useMantineTheme } from "@mantine/core"
import './JokesFeed.css'
import { useViewportSize } from "@mantine/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { getApprovedJokes } from "../services/firestore";
import type { Joke } from "../types/types";
import JokeCard from "./JokeCard";

function JokesFeed() {
  const theme = useMantineTheme()

  const [jokes, setJokes] = useState<{created: number, joke: Joke}[]>([])
  const [columns, setColumns] = useState<ReactNode[]>([])
  const { width } =  useViewportSize()

  const columnCount = width > 1300 ? 3 : width > 900 ? 2 : 1

  useEffect(() => {
    const fetchData = async () => {
      const fetchedJokes = await getApprovedJokes()
      if(fetchedJokes) {
        setJokes(fetchedJokes.concat(fetchedJokes).concat(fetchedJokes).concat(fetchedJokes).concat(fetchedJokes))
        console.log('Fetched jokes.')
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const cols: ReactNode[][] = []

    for(let i = 0; i < columnCount; i++) {
      cols.push([])
    }

    jokes.forEach((jokes, index) => {
      cols[index % columnCount].push((
        <JokeCard 
          joke={jokes.joke}
          created={jokes.created}
          seed={index * 1283} />
      ))
    })

    setColumns(cols.map((children) => (
      <Stack flex={1} gap={30} justify="start">
        {children}
      </Stack>
    )))

    console.log('Created columns.', cols.length)
  }, [jokes, width])


  return (
    <Box flex={1} className="jokes-feed-root">
      <Group justify="space-between" align="center">
        <Title>All Jokes</Title>
        <Text fs='italic' c={theme.colors.secondary[7]} >{jokes.length} jokes</Text>
      </Group>
      <Group mt={20} w='100%' gap={30} align="start">{columns}</Group>
    </Box>
  )
}

export default JokesFeed