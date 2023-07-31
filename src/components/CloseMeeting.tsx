import { councilMembers } from "@/config";
import {
  ActionIcon,
  Box,
  Select,
  Switch,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconClock, IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function CloseMeeting({
  isMinutesMode,
  item,
  setItem,
  meeting,
}: ItemProps & { meeting: Meeting }) {
  const [title, setTitle] = useDebouncedState(item.title, 200);
  const [presentation, setPresentation] = useDebouncedState(
    item.presentation,
    200,
  );
  const [decision, setDecision] = useDebouncedState(item.decision, 200);
  const [time, setTime] = useState("");

  useEffect(() => {
    setItem({
      title,
      information: "",
      presentation,
      meetingNotes: "",
      decision,
      isSecret: false,
      specialComponent: item.specialComponent,
    });
  }, [title, presentation, decision]);

  return (
    <Box>
      {!isMinutesMode && (
        <TextInput
          placeholder={`Lorem impsum...`}
          label="Asian otsikko"
          mb="md"
          defaultValue={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
      )}
      {!isMinutesMode && (
        <Textarea
          placeholder="Nuorisovaltuusto päättää..."
          label="Pohjaesitys"
          mb="md"
          defaultValue={presentation}
          onChange={(event) => setPresentation(event.currentTarget.value)}
          disabled={isMinutesMode}
        />
      )}
      {isMinutesMode && (
        <>
          <TextInput
            label="Kokous päätetty klo"
            value={time}
            onChange={(event) => {
              setTime(event.currentTarget.value);
              setDecision(
                `${meeting.chairman} päätti kokouksen klo. ${event.currentTarget.value}`,
              );
            }}
            rightSection={
              <ActionIcon
                onClick={() => {
                  const time = `${new Date()
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${new Date()
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`;
                  setTime(time);
                  setDecision(
                    `${meeting.chairman} päätti kokouksen klo. ${time}`,
                  );
                }}
              >
                <IconClock size="xs" />
              </ActionIcon>
            }
            placeholder="16:00"
          />
        </>
      )}
    </Box>
  );
}
