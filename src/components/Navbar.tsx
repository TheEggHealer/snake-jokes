import { Avatar, Box, Button, Center, Group, Input, Title, useMantineTheme, Drawer, Burger, Flex } from "@mantine/core"
import './Navbar.css'
import { IconBalloonFilled, IconCirclePlusFilled, IconDoorEnter, IconSearch } from "@tabler/icons-react"
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getUsers } from "../services/firestore";
import { Link } from "react-router";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

function Navbar() {
  const theme = useMantineTheme()
  const { user } = useAuth()
  const [profilePicture, setProfilePicture] = useState<string>('')
  const isNarrow = useMediaQuery("(max-width: 900px)")
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false)

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
    <>
      <Box className="navbar-root">
        <Group justify="space-between" className="navbar-content">
          <Group gap={40}>
            <Link to='/' style={{ textDecoration: 'inherit', color: 'inherit' }}>
              <Group>
                <Center className="navbar-logo">
                  <IconBalloonFilled />
                </Center>
                <Title order={1}>Snake Jokes</Title>
              </Group>
            </Link>
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

          {isNarrow ? (
            <Burger opened={drawerOpened} onClick={openDrawer} />
          ) : (
            <Group>
              <Link to='/new-joke'>
                <Button
                  bg={theme.colors.primary[4]}
                  bdrs={12}
                  leftSection={(
                    <IconCirclePlusFilled size={18} />
                  )}>
                  Add New Joke
                </Button>
              </Link>
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
          )}
        </Group>
      </Box>

      <Drawer opened={drawerOpened} onClose={closeDrawer} title="Menu" position="right">
        <Flex direction="column" gap={20}>
          <Link to='/new-joke' onClick={closeDrawer}>
            <Button
              w='100%'
              bg={theme.colors.primary[4]}
              bdrs={12}
              leftSection={(
                <IconCirclePlusFilled size={18} />
              )}>
              Add New Joke
            </Button>
          </Link>
          <Group>
            <Button
            flex={1}
              variant="subtle"
              bdrs={12}
              c={theme.colors.secondary[7]}
              onClick={() => { signOut(auth); closeDrawer(); }}
              leftSection={(
                <IconDoorEnter size={18} />
              )}>
              Sign Out
            </Button>
            {profilePicture && (
              <Avatar src={profilePicture} />
            )}
          </Group>
        </Flex>
      </Drawer>
    </>
  )
}

export default Navbar