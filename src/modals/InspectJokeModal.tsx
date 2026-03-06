import {
  Box,
  Title,
  Text,
  Stack,
  Center,
  Image,
  Button,
  Group,
  Divider,
  useMantineTheme,
  Modal,
} from "@mantine/core";
import { IconPhotoFilled } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import moment from "moment";
import type { Joke, UserData } from "../types/types";
import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router";
import { deleteJoke } from "../services/firestore";

export interface InspectJokeModalProps {
  joke: Joke;
  userData?: Map<string, UserData>;
  created: number;
  onClose: () => void;
}

function InspectJokeModal({ joke, created, onClose }: InspectJokeModalProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [deleting, setDeleting] = useState(false);

  const jokeDateString = moment(joke.date).format("ddd DD MMMM, YYYY");
  const createdDateString = moment(created).format("ddd DD MMMM, YYYY");

  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 100);
  }, [ref.current]);

  const handleEdit = () => {
    navigate("/new-joke", { state: { joke, created } });
    onClose();
  };

  const handleDeleteConfirm = async () => {
    closeConfirm();
    setDeleting(true);
    try {
      await deleteJoke(created);
      onClose();
    } catch (error) {
      console.error("Failed to delete joke:", error);
    }
    setDeleting(false);
  };

  return (
    <>
      <Stack gap={15}>
        <Box ref={ref}>
          {joke.images.length > 0 ? (
            <Carousel
              withIndicators={joke.images.length > 1}
              withControls={joke.images.length > 1}
              slideGap="md"
              controlSize={28}
            >
              {joke.images.map((image) => (
                <Carousel.Slide key={image}>
                  <Center w="100%">
                    <Image
                      src={image}
                      fit="contain"
                      mah={600}
                      maw="100%"
                      w="auto" // Allows the image to shrink horizontally if portrait
                      bdrs={3}
                      alt="Joke content"
                    />
                  </Center>
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Center h={200} bg="gray.0">
              <IconPhotoFilled color={theme.colors.dark[2]} size={30} />
            </Center>
          )}
        </Box>

        <Stack gap={10}>
          <Title order={2}>{joke.title}</Title>
          <Stack gap={5}>
            <Text size="sm" c={theme.colors.secondary[7]}>
              {jokeDateString}
            </Text>
            <Text size="sm" c={theme.colors.secondary[4]} fs="italic">
              (Created {createdDateString} by Jonathan)
            </Text>
          </Stack>
          <Text c={theme.colors.dark[5]}>{joke.description}</Text>
        </Stack>

        <Divider />

        <Group justify="flex-end" gap={10}>
          <Button variant="outline" color="red" onClick={openConfirm}>
            Delete Joke
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button bg={theme.colors.primary[4]} onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={confirmOpened}
        onClose={closeConfirm}
        title="Confirm Delete"
        centered
      >
        <Stack gap={15}>
          <Text>
            Are you sure you want to delete this joke? This action cannot be
            undone.
          </Text>
          <Group justify="flex-end" gap={10}>
            <Button variant="outline" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={deleting}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default InspectJokeModal;
