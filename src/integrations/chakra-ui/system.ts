import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    breakpoints: {
      sm: "724px", // 2 columns
      md: "1064px", // 3 columns
      lg: "1404px", // 4 columns
      xl: "1744px", // 5 columns
      "2xl": "2084px", // 6 columns
    },
    tokens: {
      colors: {
        gray: {
          "50": {
            value: "#F7FAFC",
          },
          "100": {
            value: "#EDF2F7",
          },
          "200": {
            value: "#E2E8F0",
          },
          "300": {
            value: "#CBD5E0",
          },
          "400": {
            value: "#A0AEC0",
          },
          "500": {
            value: "#718096",
          },
          "600": {
            value: "#4A5568",
          },
          "700": {
            value: "#2D3748",
          },
          "800": {
            value: "#1A202C",
          },
          "900": {
            value: "#171923",
          },
        },
      },
    },
    semanticTokens: {
      colors: {
        gray: {
          solid: {
            value: {
              _light: "{colors.gray.500}",
              _dark: "{colors.gray.300}",
            },
          },
        },
      },
    },
    recipes: {
      container: defineRecipe({
        base: {
          px: 0,
          maxWidth: {
            base: "320px",
            sm: "660px",
            md: "1000px",
            lg: "1340px",
            xl: "1680px",
            "2xl": "2020px",
          },
        },
      }),
    },
  },
});

export const system = createSystem(defaultConfig, config);
