import { Avatar, Box, Center, Divider, Group, Image, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core"
import type { Joke } from "../types/types"
import './JokeCard.css'
import moment from "moment"
import { IconPhoto } from "@tabler/icons-react"
import { Carousel } from "@mantine/carousel"

interface JokeCardProps {
  joke: Joke
  created: number
  seed?: number
}

function JokeCard({ joke, created, seed }: JokeCardProps) {
  const theme = useMantineTheme()

  const hash = parseInt((`${created + (seed ?? 0)}`).replace(/\D/g, ''), 10)
  const rot = (hash % 3) - 1.5

  const dateString = moment.unix(joke.date).format('ddd DD, YYYY')

  return (
    <Box className="joke-card-root" style={{ rotate: `${rot}deg` }}>
      <Stack>
        {joke.images.length > 0 ? 
          <Carousel withIndicators={joke.images.length > 1} withControls={joke.images.length > 1} height={joke.orientation === 0 ? 600 : 300}>
            {joke.images.map(image => (
              <Carousel.Slide className="image">
                <Image h='100%' src={image} fit="cover" bdrs={3}/>
              </Carousel.Slide>
            ))}
          </Carousel> :
          <Center className="image-empty" h={joke.orientation === 0 ? 500 : 200}>
            <IconPhoto size={30} />
          </Center>
        }
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