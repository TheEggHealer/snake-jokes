import { Avatar, Box, Button, Center, Group, Input, Title, useMantineTheme } from "@mantine/core"
import './Navbar.css'
import { IconBalloonFilled, IconCirclePlusFilled, IconDoorEnter, IconSearch } from "@tabler/icons-react"
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getUsers } from "../services/firestore";

function Navbar() {
  const theme = useMantineTheme()
  const { user } = useAuth()
  const [profilePicture, setProfilePicture] = useState<string>('')

  useEffect(() => {
    const fetchProfile = async () => {
      if(user) {
        const userData = await getUsers()
        setProfilePicture(userData.get(user.uid)?.profile_picture ?? '')
      }
    }
    
    fetchProfile()
  }, [user])

  return (
    <Box className="navbar-root">
      <Group justify="space-between" className="navbar-content">

        <Group gap={40}>
          <Group>
            <Center className="navbar-logo">
              <IconBalloonFilled />
            </Center>
            <Title order={1}>Snake Jokes</Title>
          </Group>
          <Input
            miw={300}
            variant="filled"
            placeholder="Search"
            leftSection={(
              <IconSearch size={18} color={theme.colors.secondary[3]} />
            )}
            classNames={{
              input: 'navbar-input'
            }}/>
        </Group>

        <Group>
          <Button
            bg={theme.colors.primary[4]}
            bdrs={12}
            onClick={() => signOut(auth)}
            leftSection={(
              <IconCirclePlusFilled size={18} />
            )}>
            Add New Joke
          </Button>
          <Button
            variant="subtle"
            bdrs={12}
            c={theme.colors.secondary[7]}
            onClick={() => signOut(auth)}
            leftSection={(
              <IconDoorEnter size={18} />
            )}>
            Sign Out
          </Button>
          {profilePicture && (
            <Avatar src={profilePicture} />
          )}
        </Group>
      </Group>
    </Box>
  )
}

export default Navbar