import * as React from 'react'

// 1. import `ChakraProvider` component
import { ChakraProvider, Container } from '@chakra-ui/react'
import CenteredContainer from './components/Container'

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <Container>
        <CenteredContainer />
      </Container>
    </ChakraProvider>
  )
}
export default App