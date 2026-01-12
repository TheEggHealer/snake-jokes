import { Box, Stack, Title, useMantineTheme } from "@mantine/core";

interface SidebarProps {
  width: number;
  borderSide: "left" | "right";
  children: React.ReactNode;
  extended: boolean;
  onClick: () => void;
}

function Sidebar({
  children,
  width,
  borderSide,
  extended,
  onClick,
}: SidebarProps) {
  const theme = useMantineTheme();

  return (
    <Box
      onClick={onClick}
      w={extended ? width : 58}
      h="100%"
      bg="gray.0"
      style={{
        borderLeft: borderSide === "left" ? "1px solid" : "",
        borderRight: borderSide === "right" ? "1px solid" : "",
        borderColor: theme.colors.gray[4],
        transition: "width 150ms ease",
        overflow: 'hidden'
      }}
    >
      {/* <Stack align={extended ? 'start' : 'center'}> */}
      {children}
      {/* </Stack> */}
    </Box>
  );
}

export default Sidebar;
