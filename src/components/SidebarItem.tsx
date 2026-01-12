import { Box, Center, Group, Text } from "@mantine/core"
import './SidebarItem.css'

interface SidebarItemProps {
  type: 'button' | 'section',
  text: string,
  selected?: boolean,
  icon?: React.ReactNode,
  iconSize: number,
  padding: number,
}

function SidebarItem({ type, text, selected, icon, iconSize, padding }: SidebarItemProps) {
  return (
    <Group 
      className={type === 'button' ? 'sidebar-item' : ''} 
      align="center" 
      py={8} 
      px={padding} 
      gap={10} 
      mt={type === 'button' ? 0 : 20} 
      wrap='nowrap'
      style={{cursor: type === 'button' ? 'pointer' : 'default', overflow: 'hidden'}}> 
      {icon && <Center style={{width: `${iconSize}px`}}>
       {icon}
      </Center>}
      <Text
        size={type === 'button' ? 'md' : 'sm'}
        fw={type === 'button' ? 400 : 700}
        c={type === 'button' ? 'black' : 'dimmed'}
        style={{textWrap: 'nowrap', overflow: 'hidden'}}
        >{text}</Text>
    </Group>
  )
}

export default SidebarItem