import {
  Box,
  Switch,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function NormalItem({
  isMinutesMode,
  item,
  setItem,
}: ItemProps) {
  const theme = useMantineTheme();

  const [title, setTitle] = useDebouncedState(item.title, 200);
  const [info, setInfo] = useDebouncedState(item.information, 200);
  const [presentation, setPresentation] = useDebouncedState(
    item.presentation,
    200,
  );
  const [meetingNotes, setMeetingNotes] = useDebouncedState(
    item.meetingNotes,
    200,
  );
  const [decision, setDecision] = useDebouncedState(item.decision, 200);
  const [isSecret, setIsSecret] = useState(item.isSecret);

  useEffect(() => {
    setItem({
      title,
      information: info,
      presentation,
      meetingNotes,
      decision,
      isSecret,
      specialComponent: item.specialComponent,
    });
  }, [title, info, presentation, meetingNotes, decision, isSecret]);

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
      <Switch
        label={isSecret ? "Ei julkinen asia" : "Julkinen asia"}
        color="green"
        offLabel={
          <IconLock size="1rem" stroke={2.5} color={theme.colors.red[6]} />
        }
        defaultChecked={!isSecret}
        onChange={(event) => setIsSecret(!event.currentTarget.checked)}
        disabled={isMinutesMode}
        mb="md"
      />
      {(!isMinutesMode || info !== "") && (
        <Textarea
          placeholder={`Lorem impsum...
Huom! Tämä kenttä ei ole pakollinen!`}
          label="Asian esittely"
          mb="md"
          defaultValue={info}
          onChange={(event) => setInfo(event.currentTarget.value)}
          disabled={isMinutesMode}
        />
      )}
      <Textarea
        placeholder="Nuorisovaltuusto päättää..."
        label="Pohjaesitys"
        mb="md"
        defaultValue={presentation}
        onChange={(event) => setPresentation(event.currentTarget.value)}
        disabled={isMinutesMode}
      />
      {isMinutesMode && (
        <>
          <Textarea
            placeholder="Lorem impsum..."
            label="Kokouskeskustelu"
            mb="md"
            defaultValue={meetingNotes}
            onChange={(event) => setMeetingNotes(event.currentTarget.value)}
          />
          <Textarea
            placeholder="Lorem impsum..."
            label="Päätös"
            mb="md"
            defaultValue={decision}
            onChange={(event) => setDecision(event.currentTarget.value)}
          />
        </>
      )}
    </Box>
  );
}
