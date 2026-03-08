import { Box, Flex, Stack } from "@mantine/core";
import "./HomePage.css";
import PageSelector from "../components/PageSelector";
import JokesFeed from "../components/JokesFeed";
import { useEffect, useState } from "react";
import { type UserData, type JokeItem } from "../types/types";
import { getUsers, listenJokes } from "../services/firestore";
import { useMediaQuery } from "@mantine/hooks";

function HomePage() {
  const [page, setPage] = useState<number>(0)
  const [allJokes, setAllJokes] = useState<{ approved: JokeItem[], pending: JokeItem[] }>({ approved: [], pending: [] })
  const [userData, setUserData] = useState<Map<string, UserData>>(new Map())

  const isNarrow = useMediaQuery("(max-width: 900px)")


  // Fetch all jokes and user data
  useEffect(() => {
    let unsub: (() => void) | undefined

    const init = async () => {
      // Start listener first so UI updates immediately on any doc change
      unsub = listenJokes((jokes) => {
        setAllJokes(jokes)
      })

      const users = await getUsers()
      setUserData(users)
    }

    init()

    return () => {
      if (unsub) unsub()
    }
  }, [])

  return (
    <Box className="home-root">
      <Flex 
        gap={20} 
        align="start" 
        className="home-content"
        direction={isNarrow ? 'column' : 'row'}>
        <Stack w={isNarrow ? '100%' : ''}>
          <PageSelector selectedPage={page} onSelectPage={setPage} />
        </Stack>

        <JokesFeed showPending={page === 1} jokes={allJokes} userData={userData} />
      </Flex>
    </Box>
  )
}

export default HomePage