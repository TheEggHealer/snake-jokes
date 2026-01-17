import { Box, Group, Stack, Text } from "@mantine/core"
import './JokesFeed.css'
import { useViewportSize } from "@mantine/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { getApprovedJokes } from "../services/firestore";
import type { Joke } from "../types/types";
import JokeCard from "./JokeCard";

function JokesFeed() {
  const [jokes, setJokes] = useState<{created: string, joke: Joke}[]>([])
  const [columns, setColumns] = useState<ReactNode[]>([])
  const { width } =  useViewportSize()

  const columnCount = width > 1300 ? 3 : width > 900 ? 2 : 1

  useEffect(() => {
    const fetchData = async () => {
      const document = await getApprovedJokes()
      if(document) {
        const jokes = Object.keys(document).map((key) => {
          return {
            created: key,
            joke: document[key]
          }
        }) as {created: string, joke: Joke}[]

        setJokes(jokes.concat(jokes).concat(jokes).concat(jokes).concat(jokes).concat(jokes).concat(jokes))
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
      <Group w='100%' gap={30} align="start">{columns}</Group>
    </Box>
  )
}

export default JokesFeed