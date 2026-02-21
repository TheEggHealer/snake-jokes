import { Avatar, Box, Button, Center, Divider, Group, Image, Modal, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core"
import type { Joke, UserData } from "../types/types"
import './JokeCard.css'
import moment from "moment"
import { IconPhotoFilled } from "@tabler/icons-react"
import { Carousel } from "@mantine/carousel"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { approveJoke, deleteJoke } from "../services/firestore"
import { useDisclosure } from "@mantine/hooks"
import InspectJokeModal from "../modals/InspectJokeModal"

interface JokeCardProps {
  joke: Joke
  userData?: Map<string, UserData>
  created: number
  seed?: number
  viewportWidth: number
  editing: boolean
}

function JokeCard({ joke, userData, created, viewportWidth, editing }: JokeCardProps) {
  const theme = useMantineTheme()
  const { user } = useAuth()

  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)
  const [approvedBy, setApprovedBy] = useState<string[]>(joke.approved_by)
  const [opened, { open, close }] = useDisclosure(false)

  const dateString = moment(joke.date).format('ddd DD MMMM, YYYY')

  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 100)
  }, [ref.current, viewportWidth])

  const height = joke.orientation === 0 ? width * 0.8 : width * 1.5

  const onApprove = async () => {
    if (user?.uid && !approvedBy.includes(user.uid)) {
      const updatedApprovedBy = [...approvedBy, user.uid]
      setApprovedBy(updatedApprovedBy) // Optimistic update
      
      try {
        await approveJoke(created, user.uid, approvedBy)
        joke.approved_by.push(user.uid) // Sync joke object
      } catch (error) {
        // Revert on failure
        setApprovedBy(approvedBy)
        console.error('Failed to approve joke:', error)
      }
    }
  }

  const onDeleteJoke = async () => {
    await deleteJoke(created)
    close()
  }

  return (
    <>
      <Box className="joke-card-root" style={{ rotate: `${0}deg` }} onClick={!editing ? open : undefined}>
        <Stack ref={ref}>
          <Box onClick={(e) => e.stopPropagation()}>
            {joke.images.length > 0 ?
              <Carousel withIndicators={joke.images.length > 1} withControls={joke.images.length > 1} height={height}>
                {joke.images.map(image => (
                  <Carousel.Slide className="image">
                    <Image h='100%' src={image} fit="cover" bdrs={3}/>
                  </Carousel.Slide>
                ))}
              </Carousel> :
              <Center className="image-empty" h={height}>
                <IconPhotoFilled color={theme.colors.dark[2]} size={30} />
              </Center>
            }
          </Box>
          <Stack p={5} gap={10}>
            <Stack gap={3}>
              <Title order={2}>{joke.title}</Title>
              <Text size="xs" c={theme.colors.secondary[7]}>{dateString}</Text>
            </Stack>
            <Text c={theme.colors.dark[5]}>{joke.description}</Text>
            <Divider />
            <Stack>
              <Group gap={5}>
                {approvedBy.map((uid) => (
                  <Tooltip label={userData?.get(uid)?.user_name}>
                    <Avatar
                      size='sm'
                      src={userData?.get(uid)?.profile_picture} />
                  </Tooltip>
                ))}
              </Group>
              {user && !editing && !approvedBy.includes(user.uid) && 
                <Button onClick={(e) => { e.stopPropagation(); onApprove() }}>
                  Approve Joke
                </Button>
              }
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Modal opened={opened} onClose={close} withCloseButton={false} size="50%">
        <InspectJokeModal 
          joke={joke} 
          userData={userData} 
          created={created}
          onClose={close}
        />
      </Modal>
    </>
  )
}

export default JokeCard