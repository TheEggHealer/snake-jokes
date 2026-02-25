import { Box, Group, Stack, Title, Text, Input, Textarea, Button, useMantineTheme, Image, ActionIcon, Radio, Badge } from "@mantine/core"
import { DateInput, type DateValue } from '@mantine/dates';
import './AddJokePage.css'
import { IconBoltFilled, IconCalendar, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import JokeCard from "../components/JokeCard";
import moment from "moment";
import { useViewportSize } from "@mantine/hooks";
import { uploadImage, deleteImage, getFileNameFromURL } from "../services/storage";
import type { Joke, UserData } from "../types/types";
import { getUsers, uploadPendingJoke, updateJoke } from "../services/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router";

interface EditState {
  joke: Joke
  created: number
}

function AddJokePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useMantineTheme()
  const { user } = useAuth()

  const { width } = useViewportSize()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [created, setCreated] = useState<DateValue>()
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string>('')
  const [orientation, setOrientation] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [userData, setUserData] = useState<Map<string, UserData>>(new Map())
  const [editingTimestamp, setEditingTimestamp] = useState<number | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const users = await getUsers()
      setUserData(users)
    }

    fetchUserData()

    // Check if we're editing a joke
    const state = location.state as EditState | null
    if (state?.joke && state?.created !== undefined) {
      setTitle(state.joke.title)
      setDescription(state.joke.description)
      setCreated(new Date(state.joke.date))
      setOrientation(state.joke.orientation)
      setEditingTimestamp(state.created)
      setExistingImages(state.joke.images || [])
    }
  }, [])

  const addImages = (newFiles: FileWithPath[]) => {
    setFiles([...files, ...newFiles])
  }

  const removeImage = (file: FileWithPath) => {
    setFiles(files.filter(f => f !== file))
  }

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter(img => img !== imageUrl))
    // Delete from Firebase
    const fileName = getFileNameFromURL(imageUrl)
    if (fileName) {
      deleteImage(fileName).catch(error => {
        console.error('Failed to delete image from storage:', error)
      })
    }
  }

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setImageUrls([...imageUrls, imageUrl])
      setImageUrl('')
    }
  }

  const removeImageUrl = (urlToRemove: string) => {
    setImageUrls(imageUrls.filter(img => img !== urlToRemove))
  }

  const onUpload = async () => {
    setLoading(true)
    if(!title || !created) {
      setLoading(false)
      return
    }
    let newImages: string[] = []

    // Upload new images to firebase storage
    if(files.length > 0) {
      newImages = await Promise.all(files.map(async (file) => {
        return await uploadImage(file)
      }))
    }

    const allImages = [...existingImages, ...newImages, ...imageUrls]

    const uploadObject: Joke = {
      approved_by: editingTimestamp !== null ? (location.state as EditState)?.joke.approved_by || [] : [],
      date: moment(created).format('YYYY-MM-DD'),
      images: allImages,
      description,
      title,
      orientation
    }

    if (editingTimestamp !== null) {
      // Update existing joke (checks both pending and approved)
      await updateJoke(uploadObject, editingTimestamp)
    } else {
      // Create new joke
      const timestamp = moment().utc().valueOf()
      await uploadPendingJoke(uploadObject, timestamp)
    }

    setLoading(false)
    navigate('/')
  }

  return (
    <Stack className="add-joke-root">
      <Title>{editingTimestamp !== null ? 'Edit Joke' : 'Add New Joke'}</Title>
      <Text>{editingTimestamp !== null ? 'Update your joke details.' : 'Capture the joke in a card, so that we never forget it!'}</Text>
      <Group align="start">
        <Stack flex={1} gap={30} justify="start" className="joke-form">
          <Stack gap={5}>
            <Text fw='bolder'>JOKE TITLE</Text>
            <Input
              variant="unstyled"
              size="md"
              fw='bolder'
              placeholder="Give this joke a name..."
              classNames={{
                input: 'title-input'
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              />
          </Stack>

          <Stack gap={5}>
            <Text fw='bolder'>WHEN DID IT HAPPEN?</Text>
            <DateInput 
              leftSection={(
                <IconCalendar color="black" size={16} />
              )}
              classNames={{
                input: 'other-input'
              }}
              value={created}
              onChange={(e) => setCreated(e)}
              size="md"
              />
          </Stack>
          
          <Stack gap={5}>
            <Text fw='bolder'>BACKSTORY</Text>
            <Textarea 
              size="md"
              classNames={{
                input: 'other-input'
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}/>
          </Stack>


          <Stack gap={5}>
            <Group justify="space-between">
              <Text fw='bolder'>IMAGES</Text>
              <Group>
                <Radio checked={orientation === 0} onClick={() => setOrientation(0)} label='Landscape' />
                <Radio checked={orientation === 1} onClick={() => setOrientation(1)} label='Portrait' />
              </Group>
            </Group>
            <Dropzone
              onDrop={addImages}
              onReject={(files) => console.log('Rejected files', files)}
              accept={IMAGE_MIME_TYPE}
              classNames={{
                root: 'drop-root',
                // inner: 'drop-root'
              }}
            >
              <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={52} color="var(--mantine-color-primary-4)" stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={52} color="var(--mantine-color-primary-4)" stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={52} color="black" stroke={1.5} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Drag images here or click to select files
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Attach as many files as you like.
                  </Text>
                </div>
              </Group>
            </Dropzone>

            <Group mt={10}>
              <Text>OR</Text>
              <Input
                flex={1}
                size="md"
                placeholder="Image URL"
                classNames={{
                  input: 'other-input'
                }}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                />
              <Button variant="subtle" onClick={addImageUrl}>Add Image</Button>
            </Group>
          </Stack>
          
          <Group wrap='wrap'>
            {existingImages && existingImages.map((imageUrl) => (
              <Box className="image-preview" key={imageUrl} pos="relative">
                <Image src={imageUrl} fit="cover" w='100%' h='100%'/>
                <Badge pos="absolute" top={5} left={5} size="sm">Uploaded</Badge>
                <ActionIcon
                  pos='absolute'
                  top={12}
                  right={12}
                  onClick={() => removeExistingImage(imageUrl)}
                  variant="subtle">
                  <IconX />
                </ActionIcon>
              </Box>
            ))}
            {imageUrls && imageUrls.map((url) => (
              <Box className="image-preview" key={url} pos="relative">
                <Image src={url} fit="cover" w='100%' h='100%'/>
                <Badge pos="absolute" top={5} left={5} size="sm">URL</Badge>
                <ActionIcon
                  pos='absolute'
                  top={12}
                  right={12}
                  onClick={() => removeImageUrl(url)}
                  variant="subtle">
                  <IconX />
                </ActionIcon>
              </Box>
            ))}
            {files && files.map((file) => {
              const fileUrl = URL.createObjectURL(file);

              return (
                <Box className="image-preview" key={file.path} pos="relative">
                  <Image src={fileUrl} fit="cover" w='100%' h='100%'/>
                  <Badge pos="absolute" top={5} left={5} size="sm">New</Badge>
                  <ActionIcon
                    pos='absolute'
                    top={12}
                    right={12}
                    onClick={() => removeImage(file)}
                    variant="subtle">
                    <IconX />
                  </ActionIcon>
                </Box>
              )
            })}
          </Group>

          <Button
            bg={theme.colors.primary[4]}
            bdrs={12}
            size="md"
            loading={loading}
            onClick={onUpload}>
              Upload Joke
          </Button>
        </Stack>

        <Stack flex={1} align="center" w='min-content'>
          <Group justify="space-between" w='70%'>
            <Title c={theme.colors.secondary[7]} order={3}>Preview</Title>
            <Badge size="lg">
              <Group gap={5}>
                <IconBoltFilled size={12}/>REAL TIME
              </Group>
            </Badge>
          </Group>
          <Box w='70%'>
            <JokeCard 
              joke={{
                title: title || 'Joke Title',
                description: description || 'Description ...',
                approved_by: user ? [user?.uid] : [],
                date: moment(created).format('YYYY-MM-DD'),
                images: [...existingImages, ...imageUrls, ...files.map(file => URL.createObjectURL(file))],
                orientation: orientation
              }}
              userData={userData}
              created={0}
              viewportWidth={width}
              editing={true}/>
          </Box>
        </Stack>
      </Group>
    </Stack>
  )
}

export default AddJokePage