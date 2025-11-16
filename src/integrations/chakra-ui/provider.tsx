import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./system";
import { ColorModeProvider } from "@/components/ui/color-mode";

interface ChakraUIProviderProps {
  children: React.ReactNode;
}

export function ChakraUIProvider({ children }: ChakraUIProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
