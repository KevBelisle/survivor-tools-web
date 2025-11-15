import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./system";

interface ChakraUIProviderProps {
	children: React.ReactNode;
}

export function ChakraUIProvider({ children }: ChakraUIProviderProps) {
	return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
