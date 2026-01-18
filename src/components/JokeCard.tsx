import { Avatar, Box, Divider, Group, Image, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core"
import type { Joke } from "../types/types"
import './JokeCard.css'
import moment from "moment"

interface JokeCardProps {
  joke: Joke
  created: number
  seed?: number
}

function JokeCard({ joke, created, seed }: JokeCardProps) {
  const theme = useMantineTheme()

  const hash = parseInt((`${created + (seed ?? 0)}`).replace(/\D/g, ''), 10)
  const rot = (hash % 3) - 1.5

  const dateString = moment.unix(created).format('ddd DD, YYYY')

  return (
    <Box className="joke-card-root" style={{ rotate: `${rot}deg` }}>
      <Stack>
        <Image src={joke.img_url} bdrs={3}/>
        <Stack p={5} gap={10}>
          <Stack gap={3}>
            <Title order={2}>{joke.title}</Title>
            <Text size="xs" c={theme.colors.secondary[7]}>{dateString}</Text>
          </Stack>
          <Text c={theme.colors.dark[5]}>{joke.description}</Text>
          <Divider />
          <Group gap={5}>
            {joke.approved_by.map((userData) => (
              <Tooltip label={userData.user_name}>
                <Avatar
                  size='sm'
                  src={userData.profile_picture} />
              </Tooltip>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Box>
  )
}

export default JokeCard