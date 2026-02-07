import { Avatar, Box, Center, Divider, Group, Image, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core"
import type { Joke, UserData } from "../types/types"
import './JokeCard.css'
import moment from "moment"
import { IconPhoto } from "@tabler/icons-react"
import { Carousel } from "@mantine/carousel"
import { useEffect, useRef, useState } from "react"

interface JokeCardProps {
  joke: Joke
  userData?: Map<string, UserData>,
  created: number
  seed?: number
  viewportWidth: number
}

function JokeCard({ joke, userData, viewportWidth }: JokeCardProps) {
  const theme = useMantineTheme()

  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)

  // const hash = parseInt((`${created + (seed ?? 0)}`).replace(/\D/g, ''), 10)
  // const rot = (hash % 3) - 1.5

  const dateString = moment(joke.date).format('ddd DD MMMM, YYYY')

  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 100)
  }, [ref.current, viewportWidth])

  const height = joke.orientation === 0 ? width * 0.8 : width * 1.5

  return (
    <Box className="joke-card-root" style={{ rotate: `${0}deg` }}>
      <Stack ref={ref}>
        {joke.images.length > 0 ? 
          <Carousel withIndicators={joke.images.length > 1} withControls={joke.images.length > 1} height={height}>
            {joke.images.map(image => (
              <Carousel.Slide className="image">
                <Image h='100%' src={image} fit="cover" bdrs={3}/>
              </Carousel.Slide>
            ))}
          </Carousel> :
          <Center className="image-empty" h={height}>
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
            {joke.approved_by.map((uid) => (
              <Tooltip label={userData?.get(uid)?.user_name}>
                <Avatar
                  size='sm'
                  src={userData?.get(uid)?.profile_picture} />
              </Tooltip>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Box>
  )
}

export default JokeCard