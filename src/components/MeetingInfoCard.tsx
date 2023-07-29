import {
  Accordion,
  Box,
  Text,
  TextInput,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import AttendanceTable from "./AttendanceTable";

type MeetingInfoCardProps = {
  meeting: Meeting;
  updateMeeting: (meeting: Meeting) => void;
  classes: any;
  isMinutesMode: boolean;
};

export default function MeetingInfoCard({
  meeting,
  updateMeeting,
  classes,
  isMinutesMode,
}: MeetingInfoCardProps) {
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        borderRadius: theme.radius.lg,
        border: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[2]
        }`,
        marginTop: "0.75rem",
      }}
    >
      <Accordion.Item
        value={`meeting-info`}
        sx={{ borderRadius: theme.radius.lg }}
      >
        <div className={classes.item}>
          <Accordion.Control>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={classes.itemBody}>
                <Text className={classes.symbol}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconInfoCircle size={30} />
                  </Box>
                </Text>
                <div>
                  <Text>Kokouksen tiedot</Text>
                  <Text color="dimmed" size="sm">
                    Kokouspaikka
                    {isMinutesMode ? " ja paikallaolijat" : ""}
                  </Text>
                </div>
              </div>
            </div>
          </Accordion.Control>
        </div>
        <Accordion.Panel
          sx={{
            backgroundColor:
              theme.colorScheme === "light" ? "white" : "transparent",
            borderBottomRightRadius: "0.75rem",
            borderBottomLeftRadius: "0.75rem",
          }}
        >
          <TextInput
            label="Kokouspaikka"
            defaultValue={meeting.location}
            onChange={(event) => {
              meeting.location = event.currentTarget.value;
              updateMeeting(meeting);
            }}
          />
          {isMinutesMode && (
            <AttendanceTable meeting={meeting} updateMeeting={updateMeeting} />
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Box>
  );
}
