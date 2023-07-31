import {
  councilMembers,
  defaultChairman,
  defaultMeetingPlace,
  defaultOtherAttendees,
  defaultSecretary,
  forcedFirst,
  forcedLast,
} from "@/config";
import { meetingsTable } from "@/database.config";
import { Button, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewMeetingForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [creating, setCreating] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setCreating(true);
        const meeting = {
          date,
          councilMembers: councilMembers,
          forcedFirst: forcedFirst,
          forcedLast: forcedLast,
          items: [],
          location: defaultMeetingPlace,
          otherAttendees: defaultOtherAttendees,
          chairman: defaultChairman,
          secretary: defaultSecretary,
          checkers: [],
        };
        console.log(meeting);
        const id = await meetingsTable.add({
          date: meeting.date,
          json: JSON.stringify(meeting),
          version: 0,
        });
        setCreating(false);
        modals.closeAll();
        router.push(`/meeting/${id}`);
      }}
    >
      <TextInput
        label="Päivämäärä"
        placeholder="01.01.2023"
        maw={400}
        mx="auto"
        pattern="\d{1,2}\.\d{1,2}\.\d{4}"
        sx={{
          zIndex: 1000,
        }}
        value={date}
        onChange={(e) => setDate(e.currentTarget.value)}
      />
      <Button fullWidth type="submit" mt="md" loading={creating}>
        Luo kokous
      </Button>
    </form>
  );
}
