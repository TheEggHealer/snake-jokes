import { Box, Group, Stack } from "@mantine/core";
import "./HomePage.css";
import PageSelector from "../components/PageSelector";
import JokesFeed from "../components/JokesFeed";

function HomePage() {
  return (
    <Box className="home-root">
      <Group gap={20} align="start" className="home-content">
        <Stack>
          <PageSelector />
        </Stack>

        <JokesFeed />
      </Group>
    </Box>
  )
}

export default HomePage;
