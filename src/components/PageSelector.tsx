import { Box, Group, Stack, Text, useMantineTheme } from "@mantine/core"
import './PageSelector.css'
import { useState, type ReactNode } from "react"
import { IconClockFilled, IconLayoutDashboardFilled } from "@tabler/icons-react"

function PageSelector() {
  const [selectedPage, setSelectedPage] = useState<number>(0)
  const theme = useMantineTheme()

  return (
    <Box className="page-selector-root">
      <Stack>
        <Text c={theme.colors.dark[5]} fw='lighter' size="sm" className="page-selector-title">PAGES</Text>
      
        <Stack gap={5}>
          <PageSelectorItem
            text="All Jokes"
            selected={selectedPage === 0}
            onClick={() => setSelectedPage(0)}
            icon={(
              <IconLayoutDashboardFilled size={20} />
            )}/>
          <PageSelectorItem
            text="Pending"
            selected={selectedPage === 1}
            onClick={() => setSelectedPage(1)}
            icon={(
              <IconClockFilled size={20} />
            )}/>
        </Stack>
      </Stack>
    </Box>
  )
}

interface PageSelectorItemProps {
  text: string
  selected: boolean,
  icon: ReactNode,
  onClick: () => void
}

function PageSelectorItem({ text, selected, icon, onClick }: PageSelectorItemProps) {
  return (
    <Box className={"page-selector-item" + (selected ? " selected" : "")} onClick={onClick}>
      <Group gap={10} align="center">
        {icon}
        <Text>{text}</Text>
      </Group>
    </Box>
  )
}

export default PageSelector