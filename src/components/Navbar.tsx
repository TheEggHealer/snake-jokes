import { Box, Button, Center, Group, Input, Title, useMantineTheme } from "@mantine/core"
import './Navbar.css'
import { IconBalloonFilled, IconCirclePlusFilled, IconDoorEnter, IconSearch } from "@tabler/icons-react"
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Navbar() {
  const theme = useMantineTheme();

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
            onClick={() => signOut(auth)}
            leftSection={(
              <IconCirclePlusFilled size={18} />
            )}>
            Add New Joke
          </Button>
          <Button
            variant="subtle"
            c={theme.colors.secondary[7]}
            onClick={() => signOut(auth)}
            leftSection={(
              <IconDoorEnter size={18} />
            )}>
            Sign Out
          </Button>
        </Group>
      </Group>
    </Box>
  )
}

export default Navbar