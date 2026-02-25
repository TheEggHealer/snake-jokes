import { Box, Group, Stack, Title, Text, useMantineTheme } from "@mantine/core"
import './JokesFeed.css'
import { useViewportSize } from "@mantine/hooks"
import { type ReactNode } from "react"
import type { JokeItem, UserData } from "../types/types"
import JokeCard from "./JokeCard"

interface JokesFeedProps {
  showPending: boolean
  jokes?: { approved: JokeItem[], pending: JokeItem[] }
  userData: Map<string, UserData>
}

function createCols(visibleJokes: JokeItem[], width: number, userData: Map<string, UserData>) {
  const colCount = width > 1300 ? 3 : width > 900 ? 2 : 1
  const colHeights: number[] = Array(colCount).fill(0)
  let cols: ReactNode[][] = []

  for(let i = 0; i < colCount; i++) {
    cols.push([])
  }

  // Estimate card height based on orientation and width
  const cardWidth = Math.max(width / colCount - 40, 200)
  const getEstimatedHeight = (joke: JokeItem['joke']) => {
    const imageHeight = joke.orientation === 0 ? cardWidth * 0.8 : cardWidth * 1.5
    const textHeight = 150 // estimated height for title, date, description, and buttons
    return imageHeight + textHeight
  }

  visibleJokes.forEach((jokeItem, index) => {
    // Find column with shortest height
    let shortestColIndex = 0
    let shortestHeight = colHeights[0]
    for (let i = 1; i < colCount; i++) {
      if (colHeights[i] < shortestHeight) {
        shortestHeight = colHeights[i]
        shortestColIndex = i
      }
    }

    const estimatedHeight = getEstimatedHeight(jokeItem.joke)
    colHeights[shortestColIndex] += estimatedHeight

    cols[shortestColIndex].push((
      <JokeCard 
        joke={jokeItem.joke}
        userData={userData}
        created={jokeItem.created}
        seed={index * 1283}
        viewportWidth={width}
        key={jokeItem.created}
        editing={false} />
    ))
  })

  return cols.map((children) => (
    <Stack flex={1} gap={30} justify="start">
      {children}
    </Stack>
  ))
}

function JokesFeed({ showPending, jokes, userData }: JokesFeedProps) {
  const theme = useMantineTheme()

  const { width } =  useViewportSize()

  const visibleJokes = jokes && (showPending ? jokes.pending : jokes.approved) || []
  const cols = createCols(visibleJokes, width, userData)

  return (
    <Box flex={1} className="jokes-feed-root">
      <Group justify="space-between" align="center">
        <Title>{showPending ? 'Pending Jokes' : 'All Jokes'}</Title>
        <Text fs='italic' c={theme.colors.secondary[7]} >{visibleJokes.length} joke{visibleJokes.length > 1 ? 's' : ''}</Text>
      </Group>
      <Group mt={20} w='100%' gap={30} align="start">{cols}</Group>
    </Box>
  )
}

export default JokesFeed