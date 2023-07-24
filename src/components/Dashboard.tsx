import React, { useState } from 'react';
import {
  AppShell,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Switch,
  useMantineColorScheme,
} from '@mantine/core';
import { Navbar } from './Navbar';
import Logo from './Logo';
import { IconMoonStars, IconSun } from '@tabler/icons-react';


export default function Dashboard({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);


  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar />
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Logo height={35} style={{ color: theme.colorScheme === 'light' ? 'black' : 'white' }} />
            </div>
            <Switch
              checked={colorScheme === 'dark'}
              onChange={() => toggleColorScheme()}
              size="lg"
              offLabel={<IconSun color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
              onLabel={<IconMoonStars color={theme.white} size="1.25rem" stroke={1.5} />}
            />
          </div>
        </Header>
      }
    >
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  );
}