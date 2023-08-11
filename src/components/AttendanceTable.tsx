import {
  ActionIcon,
  ScrollArea,
  Switch,
  Table,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

interface AttendanceTableProps {
  meeting: Meeting;
  updateMeeting: (meeting: Meeting) => void;
}

export default function AttendanceTable({
  meeting,
  updateMeeting: setMeeting,
}: AttendanceTableProps) {
  const theme = useMantineTheme();

  return (
    <>
      <h2>Paikallaolijat</h2>
      <h3>Nuorisovaltuutetut</h3>
      <ScrollArea>
        <Table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Paikalla</th>
              <th>Liittyi myöhässä</th>
              <th>Poistui paikalta</th>
            </tr>
          </thead>
          <tbody>
            {meeting.councilMembers.map((member, index) => (
              <AttendeeRow
                member={member}
                setMember={(newMember) => {
                  meeting.councilMembers[index] = newMember;
                  setMeeting(meeting);
                }}
              />
            ))}
          </tbody>
        </Table>
      </ScrollArea>
      <h3>Muut puhe- ja läsnäolo-oikeutetut</h3>
      <ScrollArea>
        <Table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Rooli</th>
              <th>Liittyi myöhässä</th>
              <th>Poistui paikalta</th>
            </tr>
          </thead>
          <tbody>
            {meeting.otherAttendees.map((member, index) => (
              <OtherAttendeeRow
                member={member}
                setMember={(newMember) => {
                  meeting.councilMembers[index] = newMember;
                  setMeeting(meeting);
                }}
                removeMember={() => {
                  meeting.otherAttendees.splice(index, 1);
                }}
              />
            ))}
            <AddOtherAttendeeForm addAttendee={() => null} />
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

function OtherAttendeeRow({
  member,
  setMember,
  removeMember,
}: {
  member: CouncilMember;
  setMember: (member: CouncilMember) => void;
  removeMember: () => void;
}) {
  const theme = useMantineTheme();

  return (
    <tr key={member.name}>
      <td>{member.name}</td>
      <td>
        <Switch
          defaultChecked={!member.absent}
          onChange={(event) => {
            member.absent = !event.currentTarget.checked;
            setMember(member);
          }}
          color="teal"
          size="md"
          label={member.absent ? "Poissa" : "Paikalla"}
          thumbIcon={
            !member.absent ? (
              <IconCheck
                size={12}
                color={theme.colors.teal[theme.fn.primaryShade()]}
                stroke={3}
              />
            ) : (
              <IconX
                size={12}
                color={theme.colors.red[theme.fn.primaryShade()]}
                stroke={3}
              />
            )
          }
        />
      </td>
      <td>
        <TextInput
          sx={{ minWidth: "150px" }}
          placeholder="16:18"
          maxLength={5}
          defaultValue={member.joinedAt}
          onChange={(event) => {
            member.joinedAt = event.currentTarget.value;
            setMember(member);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.joinedAt = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setMember(member);
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
      <td>
        <TextInput
          sx={{ minWidth: "150px" }}
          placeholder="16:12"
          maxLength={5}
          defaultValue={member.leftAt}
          onChange={(event) => {
            member.leftAt = event.currentTarget.value;
            setMember(member);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.leftAt = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setMember(member);
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
      <td>
        <button onClick={removeMember}>Poista</button>
      </td>
    </tr>
  );
}

function AttendeeRow({
  member,
  setMember,
}: {
  member: CouncilMember;
  setMember: (member: CouncilMember) => void;
}) {
  const theme = useMantineTheme();

  return (
    <tr key={member.name}>
      <td>{member.name}</td>
      <td>
        <Switch
          defaultChecked={!member.absent}
          onChange={(event) => {
            member.absent = !event.currentTarget.checked;
            setMember(member);
          }}
          color="teal"
          size="md"
          label={member.absent ? "Poissa" : "Paikalla"}
          thumbIcon={
            !member.absent ? (
              <IconCheck
                size={12}
                color={theme.colors.teal[theme.fn.primaryShade()]}
                stroke={3}
              />
            ) : (
              <IconX
                size={12}
                color={theme.colors.red[theme.fn.primaryShade()]}
                stroke={3}
              />
            )
          }
        />
      </td>
      <td>
        <TextInput
          sx={{ minWidth: "150px" }}
          placeholder="16:18"
          maxLength={5}
          defaultValue={member.joinedAt}
          onChange={(event) => {
            member.joinedAt = event.currentTarget.value;
            setMember(member);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.joinedAt = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setMember(member);
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
      <td>
        <TextInput
          sx={{ minWidth: "150px" }}
          placeholder="16:12"
          maxLength={5}
          defaultValue={member.leftAt}
          onChange={(event) => {
            member.leftAt = event.currentTarget.value;
            setMember(member);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.leftAt = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setMember(member);
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
    </tr>
  );
}

function AddOtherAttendeeForm({
  addAttendee,
}: {
  addAttendee: (attendee: Attendee) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [joined, setJoined] = useState("");
  const [left, setLeft] = useState("");

  return (
    <tr>
      <td>
        <TextInput
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder="Nimi"
        />
      </td>
      <td>
        <TextInput
          value={role}
          onChange={(event) => setRole(event.currentTarget.value)}
          placeholder="Rooli"
        />
      </td>
      <td>
        <TextInput
          sx={{ minWidth: "150px" }}
          value={joined}
          onChange={(event) => setJoined(event.currentTarget.value)}
          placeholder="15:18"
          maxLength={5}
          rightSection={
            <ActionIcon
              onClick={() => {
                setJoined(
                  `${new Date()
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${new Date()
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`,
                );
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
      <td>
        <TextInput
          sx={{ minWidth: "150px" }}
          value={left}
          onChange={(event) => setLeft(event.currentTarget.value)}
          placeholder="16:12"
          maxLength={5}
          rightSection={
            <ActionIcon
              onClick={() => {
                setLeft(
                  `${new Date()
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${new Date()
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`,
                );
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
      <td>
        <ActionIcon
          color="green"
          onClick={() => {
            addAttendee({
              name,
              role,
              joinedAt: joined,
              leftAt: left,
            });

            setName("");
            setRole("");
            setJoined("");
            setLeft("");
          }}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </td>
    </tr>
  );
}
