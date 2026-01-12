import { Box, Center, Stack, Title, Text, Input, Group, Button, Loader } from "@mantine/core"
import './AuthPage.css'
import { IconMailFilled, IconPassword } from "@tabler/icons-react"

import { signIn } from "../services/auth"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

function AuthPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('\x80')

  return (
    <Box h='100vh'>
      <Center h='100%'>
        <Stack align="center" gap={30}>
          <Box className="auth-panel" p={20}>
            <Stack>
              <Stack gap={5} align="center">
                <Title order={2}>Snakes in the Lake</Title>
                <Text>Sign In</Text>
              </Stack>
              <Stack gap={10} pt={30}>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  placeholder="Email"
                  leftSection={(<IconMailFilled size={18} />)}/>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  placeholder="Password"
                  type="password"
                  leftSection={(<IconPassword size={18} />)}/>
                <Text size="sm" c='red'>{errorMsg}</Text>
              </Stack>
              <Group justify="end">
                <Button loading={loading} onClick={async () => {
                  setErrorMsg('\x80')
                  setLoading(true)
                  try {
                    await signIn(email, password)
                  } catch {
                    setErrorMsg('Something went wrong')
                  }
                  setLoading(false)
                  }}>
                  <Text>Sign In</Text>
                </Button>
              </Group>
            </Stack>
          </Box>
        </Stack>
      </Center>
    </Box>
  )
}

export default AuthPage