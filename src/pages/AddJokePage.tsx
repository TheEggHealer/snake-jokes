import { Box, Group, Stack, Title, Text, Input, Textarea, Button, useMantineTheme, Image, ActionIcon, Radio } from "@mantine/core"
import { DateInput, type DateValue } from '@mantine/dates';
import './AddJokePage.css'
import { IconCalendar, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from "@mantine/dropzone";
import { useState } from "react";
import JokeCard from "../components/JokeCard";
import moment from "moment";
import { useViewportSize } from "@mantine/hooks";
import { uploadImage } from "../services/storage";
import type { Joke } from "../types/types";
import { uploadPendingJoke } from "../services/firestore";

function AddJokePage() {
  const theme = useMantineTheme()

  const { width } = useViewportSize()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [created, setCreated] = useState<DateValue>()
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [orientation, setOrientation] = useState<number>(0)

  const addImages = (newFiles: FileWithPath[]) => {
    setFiles([...files, ...newFiles])
  }

  const removeImage = (file: FileWithPath) => {
    setFiles(files.filter(f => f !== file))
  }

  const onUpload = async () => {
    if(!title || !created) return
    let images: string[] = []

    // Upload images to firebase storage
    if(files) {
      images = await Promise.all(files.map(async (file) => {
        return await uploadImage(file)
      }))
    }

    const timestamp = moment().utc().valueOf()
    const uploadObject: Joke = {
      approved_by: [] as string[],
      date: moment(created).format('YYYY-MM-DD'),
      images,
      description,
      title,
      orientation
    }

    await uploadPendingJoke(uploadObject, timestamp)
  }

  return (
    <Stack className="add-joke-root">
      <Title>Add New Joke</Title>
      <Text>Capture the joke in a card, so that we never forget it!</Text>
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
              maxSize={5 * 1024 ** 2}
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
                    Attach as many files as you like, each file should not exceed 5mb
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </Stack>
          
          <Group wrap='wrap'>
            {files && files.map((file) => {
              const imageUrl = URL.createObjectURL(file);

              return (
                <Box className="image-preview" key={file.path}>
                  <Image src={imageUrl} fit="cover" w='100%' h='100%'/>
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
            onClick={onUpload}>
              Upload Joke
          </Button>
        </Stack>

        <Stack flex={1} align="center">
          <Box w='70%'>
            <JokeCard 
              joke={{
                title: title || 'Joke Title',
                description: description || 'Description ...',
                approved_by: [],
                date: moment(created).format('YYYY-MM-DD'),
                images: files.length > 0 ? files.map(file => URL.createObjectURL(file)) : [],
                orientation: orientation
              }}
              created={0}
              viewportWidth={width}/>
          </Box>
        </Stack>
      </Group>
    </Stack>
  )
}

export default AddJokePage