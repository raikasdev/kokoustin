import { councilMembers } from "@/config";
import {
  Box,
  MultiSelect,
  Select,
  Switch,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function MinutesChecker({
  isMinutesMode,
  item,
  setItem,
  meeting,
  setMeeting,
}: ItemProps & { meeting: Meeting; setMeeting: (meeting: Meeting) => void }) {
  const [title, setTitle] = useDebouncedState(item.title, 200);
  const [presentation, setPresentation] = useDebouncedState(
    item.presentation,
    200,
  );
  const [decision, setDecision] = useDebouncedState(item.decision, 200);

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
          <MultiSelect
            data={meeting.councilMembers
              .filter((i) => !i.absent)
              .filter(
                (i) =>
                  i.name !== meeting.chairman && i.name !== meeting.secretary,
              )
              .map((i) => ({ label: i.name, value: i.name }))}
            label="Pöytäkirjantarkastajat"
            placeholder="Valitse 2"
            onChange={(values) => {
              meeting.checkers = values;
              setMeeting(meeting);
              setDecision(
                `Pöytäkirjantarkastajiksi valittiin ${values.join(
                  " ja ",
                )}. Ääntenlaskijana toimii puheenjohtaja ${meeting.chairman}.`,
              );
            }}
          />
        </>
      )}
    </Box>
  );
}
