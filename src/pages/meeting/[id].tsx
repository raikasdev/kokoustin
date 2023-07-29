import Logo from "@/components/Logo";
import MeetingPage from "@/components/pages/MeetingPage";
import database, { meetingsTable } from "@/database.config";
import { Box, Flex, Loader, Text, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconX, IconZoomExclamation } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Meeting() {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null | undefined>(undefined); // null = not found, undefined = searching
  const [debouncedMeeting, cancel] = useDebouncedValue(meeting, 1000);

  useEffect(() => {
    if (!router.query.id) return;

    (async () => {
      const key = parseInt(`${router.query.id || "0"}`);
      const meeting = await meetingsTable.get(key);
      if (!meeting) {
        setMeeting(null);
        cancel();
        return;
      }

      const newMeeting = JSON.parse(meeting.json);
      newMeeting.id = meeting.id;

      setMeeting(newMeeting);
      cancel();
    })();
  }, [router.query.id]);

  useEffect(() => {
    if (!debouncedMeeting) return;

    database.transaction("rw", meetingsTable, async function () {
      const meeting = await meetingsTable.get(debouncedMeeting.id);
      if (!meeting) return;
      meetingsTable.put(
        {
          id: debouncedMeeting?.id,
          date: debouncedMeeting?.date,
          json: JSON.stringify(debouncedMeeting),
          version: meeting.version || 0,
        },
        debouncedMeeting.id,
      );
    });
  }, [debouncedMeeting]);

  if (meeting === undefined)
    return (
      <Flex
        align="center"
        justify="center"
        direction="column"
        gap="lg"
        sx={{ height: "100vh", width: "100vw" }}
      >
        <Logo
          height="2rem"
          style={{ maxWidth: "50vw", marginBottom: "1rem" }}
        />
        <Loader variant="bars" />
        <Text align="center">Ladataan</Text>
      </Flex>
    );

  if (meeting === null)
    return (
      <Flex
        align="center"
        justify="center"
        direction="column"
        gap="lg"
        sx={{ height: "100vh", width: "100vw" }}
      >
        <Logo
          height="2rem"
          style={{ maxWidth: "50vw", marginBottom: "1rem" }}
        />
        <IconZoomExclamation color="red" size="60px" />
        <div>
          <Text align="center">
            Oletko muistanut tuoda muutokset pilvestä?
            <br />
            <Link href="/">Takaisin etusivulle</Link>
          </Text>
        </div>
      </Flex>
    );

  return (
    <MeetingPage
      meeting={meeting}
      setMeeting={(meeting) => setMeeting({ ...meeting })}
    />
  );
}
