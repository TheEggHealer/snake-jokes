import { Box, Group, Stack } from "@mantine/core";
import "./HomePage.css";
import PageSelector from "../components/PageSelector";
import JokesFeed from "../components/JokesFeed";
import { useEffect, useState } from "react";
import { type UserData, type JokeItem } from "../types/types";
import { getJokes, getUsers } from "../services/firestore";

function HomePage() {
  const [page, setPage] = useState<number>(0)
  const [allJokes, setAllJokes] = useState<{ approved: JokeItem[], pending: JokeItem[] }>()
  const [userData, setUserData] = useState<Map<string, UserData>>({} as Map<string, UserData>)

  // Fetch all jokes and user data
  useEffect(() => {
    const fetchJokes = async () => {
      const userData = await getUsers()
      setUserData(userData)

      const approvedJokes = await getJokes({ pending: false })
      const pendingJokes = await getJokes({ pending: true })

      setAllJokes({
        approved: approvedJokes || [],
        pending: pendingJokes || []
      })
    }
    
    fetchJokes()
  }, [])

  return (
    <Box className="home-root">
      <Group gap={20} align="start" className="home-content">
        <Stack>
          <PageSelector selectedPage={page} onSelectPage={setPage} />
        </Stack>

        <JokesFeed showPending={page === 1} jokes={allJokes} userData={userData} />
      </Group>
    </Box>
  )
}

export default HomePage