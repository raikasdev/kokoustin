import React, { useState } from "react";
import {
  AppShell,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  Switch,
  useMantineColorScheme,
  Box,
} from "@mantine/core";
import Navbar from "./Navbar";
import Logo from "./Logo";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function Dashboard({
  children,
  meeting,
}: {
  children: React.ReactNode | React.ReactNode[];
  meeting: Meeting;
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<Navbar visible={opened} meeting={meeting} />}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Box
          w={{
            base: "100%",
            lg: "80%",
            xl: "65%",
          }}
        >
          {children}
        </Box>
      </div>
    </AppShell>
  );
}
