import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/styles";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: "light" }}
      >
        <Notifications />
        <ModalsProvider>
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
