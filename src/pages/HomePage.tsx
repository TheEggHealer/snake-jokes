import { ActionIcon, Text, Box, Center, Divider, Group, Title, Stack, Button } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";
import { IconBook, IconChevronLeft, IconChevronRight, IconConfetti, IconGitCompare, IconHistory, IconMessage, IconMoodSmileBeam, IconPencilPlus, IconSchool, IconSearch } from "@tabler/icons-react";
import SidebarItem from "../components/SidebarItem";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getApprovedJokes, getDocument } from "../services/firestore";
import type { Joke } from "../types/types";
import JokeCard from "../components/JokeCard";

const iconSize = 18
const padding = 20

function HomePage() {
  const [navExtended, setNavExtended] = useState<boolean>(true)
  const [sbExtended, setSBExtended] = useState<boolean>(true)

  const [jokes, setJokes] = useState<{created: string, joke: Joke}[]>([])

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

        setJokes(jokes)
      }
    }

    fetchData()
  }, [])

  return (
    <Box className="session-root">
      {/* Navigation */}
      <Sidebar 
        onClick={!navExtended ? () => setNavExtended(true) : () => {}}
        extended={navExtended} 
        width={250} 
        borderSide="right">
        <Group mt={30} mx={20} h={30} align='center' justify="space-between" flex={1} wrap="nowrap">
          <Center style={{width: `${iconSize}px`}}>
            <IconConfetti size={iconSize} />
          </Center>

          {navExtended && <ActionIcon bg='none' size='lg' onClick={() => setNavExtended(!navExtended)}>
            <IconChevronLeft color='black' size={20} />
          </ActionIcon>}
        </Group>
        
        <Box my={20} />
        <SidebarItem iconSize={iconSize} padding={padding} type="button" text="All Jokes" icon={
          <IconHistory size={iconSize} />
        }/>
        <SidebarItem iconSize={iconSize} padding={padding} type="button" text="Joke Compare" icon={
          <IconGitCompare size={iconSize} />
        }/>
        <SidebarItem iconSize={iconSize} padding={padding} type="button" text="Chat Bot" icon={
          <IconMessage size={iconSize} />
        }/>
        {/* {navExtended && <Box>
          <SidebarItem iconSize={iconSize} padding={padding} type="section" text="Sessions" />
          <SidebarItem iconSize={iconSize} padding={padding} type="button" text="Vec2Face" icon={
            <IconMessage size={iconSize} />
          }/>
          <SidebarItem iconSize={iconSize} padding={padding} type="button" text="Arc2Face" icon={
            <IconMessage size={iconSize} />
          }/>
          <SidebarItem iconSize={iconSize} padding={padding} type="button" text="Diffusion Models" icon={
            <IconMessage size={iconSize} />
          }/>
        </Box>} */}
        <Center mt={20}>
          <Button onClick={() => signOut(auth)}>
            <Text>Sign Out</Text>
          </Button>
        </Center>
      </Sidebar>

      {/* Teacher Panel */}
      <Box flex={1} mt={30}>
        {jokes.map(({ created, joke }) => (
          <JokeCard joke={joke} created={created} key={created} />
        ))}
      </Box>
    </Box>
  );
}

export default HomePage;
