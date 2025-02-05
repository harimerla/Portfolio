// theme.ts

// main.tsx or App.tsx
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Portfolio from "./components/Portfolio";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Portfolio />
    </ChakraProvider>
  );
}

export default App;
