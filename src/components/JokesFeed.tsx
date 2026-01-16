import { Box, Text } from "@mantine/core"
import './JokesFeed.css'
import { useViewportSize } from "@mantine/hooks";

function JokesFeed() {
  const { width } =  useViewportSize()

  const columns = width > 1300 ? 3 : width > 900 ? 2 : 1

  return (
    <Box flex={1} className="jokes-feed-root">
      <Text>Width: {width}</Text>
      <Text>Columns: {columns}</Text>
    </Box>
  )
}

export default JokesFeed