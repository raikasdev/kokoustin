import {
  Button,
  Flex,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconCheck,
  IconCloudDownload,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import NewMeetingForm from "../NewMeetingForm";
import { meetingsTable } from "@/database.config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadFromCloud } from "@/cloud-saving";
import { notifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    width: "100%",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,

    "&:hover": {
      backgroundColor: theme.colors.gray[1],
    },
  },

  symbol: {
    fontSize: rem(30),
    fontWeight: 700,
    width: rem(60),
  },
}));

export default function HomePage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const { classes } = useStyles();

  const newMeeting = () => {
    modals.open({
      title: "Luo uusi kokous",
      children: <NewMeetingForm />,
    });
  };

  useEffect(() => {
    (async () => {
      setMeetings(
        (await meetingsTable.filter(() => true).toArray())
          .map((meetingObject) => JSON.parse(meetingObject.json) as Meeting)
          .sort(
            (a, b) =>
              new Date(b.date.split(".").reverse().join("/")).getTime() -
              new Date(a.date.split(".").reverse().join("/")).getTime(),
          ),
      );
    })();
  }, []);

  return (
    <Paper withBorder shadow="md" p={20} mt={30} radius="md">
      <Flex justify="space-evenly" gap="lg" mb="lg">
        <Button leftIcon={<IconPlus />} onClick={newMeeting}>
          Luo uusi kokous
        </Button>
        <Button
          leftIcon={<IconCloudDownload />}
          variant="light"
          onClick={async () => {
            notifications.hide("loading");
            notifications.show({
              id: "loading",
              withCloseButton: false,
              title: "Ladataan tietoja",
              message: "Ladataan tietoja pilvipalvelusta...",
              loading: true,
              autoClose: false,
            });
            await loadFromCloud();
            notifications.update({
              id: "loading",
              withCloseButton: true,
              title: "Ladattu",
              message: "Muutokset ladattu pilvipalvelusta!",
              loading: false,
              icon: <IconCheck />,
              autoClose: 4000,
              color: "green",
            });

            setMeetings(
              (await meetingsTable.filter(() => true).toArray())
                .map(
                  (meetingObject) => JSON.parse(meetingObject.json) as Meeting,
                )
                .sort(
                  (a, b) =>
                    new Date(b.date.split(".").reverse().join("/")).getTime() -
                    new Date(a.date.split(".").reverse().join("/")).getTime(),
                ),
            );
          }}
        >
          Lataa muutokset pilvestä
        </Button>
      </Flex>

      <Stack>
        <ScrollArea h={500}>
          <Text color="gray" align="center" my="md">
            Tai valitse kokous
          </Text>
          {meetings.length === 0 && (
            <Text align="center" my="md">
              Aika tyhjää täällä! Muista synkronoida tiedot!
            </Text>
          )}
          {meetings.map((meeting) => (
            <UnstyledButton
              className={classes.item}
              key={meeting.id}
              onClick={() => router.push(`/meeting/${meeting.id}`)}
            >
              <div>
                <Text>{meeting.date}</Text>
                <Text color="dimmed" size="sm">
                  {meeting.items.length} käsiteltävää asiakohtaa (pl.
                  pakolliset, kokoustiedote, muut asiat)
                </Text>
              </div>
            </UnstyledButton>
          ))}
        </ScrollArea>
      </Stack>
    </Paper>
  );
}
