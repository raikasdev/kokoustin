import {
  ActionIcon,
  ScrollArea,
  Switch,
  Table,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconClock, IconPlus, IconX } from "@tabler/icons";
import { useState } from "react";

export default function Attendees({
  poytakirja,
  setPoytakirja,
}: {
  poytakirja: Poytakirja;
  setPoytakirja: (value: Poytakirja) => void;
}) {
  const theme = useMantineTheme();
  const pkc = { ...poytakirja };

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newLate, setNewLate] = useState("");
  const [newLeft, setNewLeft] = useState("");
  const rows = poytakirja.council.map((member) => (
    <tr key={member.name}>
      <td>{member.name}</td>
      <td>{member.role}</td>
      <td>
        <Switch
          checked={!member.absent}
          onChange={(event) => {
            member.absent = !event.currentTarget.checked;
            setPoytakirja(pkc);
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
          placeholder="15:18"
          pattern="\d\d:\d\d"
          maxLength={5}
          value={member.joinedLate}
          onClick={(event) => {
            member.joinedLate = event.currentTarget.value;
            setPoytakirja(pkc);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.joinedLate = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setPoytakirja(pkc);
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
          pattern="\d\d:\d\d"
          maxLength={5}
          value={member.left}
          onClick={(event) => {
            member.left = event.currentTarget.value;
            setPoytakirja(pkc);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.left = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setPoytakirja(pkc);
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
    </tr>
  ));

  const rowsOther = poytakirja.other.map((member) => (
    <tr key={member.name}>
      <td>{member.name}</td>
      <td>{member.role}</td>
      <td>
        <TextInput
          sx={{ minWidth: "150px" }}
          placeholder="15:18"
          pattern="\d\d:\d\d"
          maxLength={5}
          value={member.joinedLate}
          onClick={(event) => {
            member.joinedLate = event.currentTarget.value;
            setPoytakirja(pkc);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.joinedLate = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setPoytakirja(pkc);
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
          pattern="\d\d:\d\d"
          maxLength={5}
          value={member.left}
          onClick={(event) => {
            member.left = event.currentTarget.value;
            setPoytakirja(pkc);
          }}
          rightSection={
            <ActionIcon
              onClick={() => {
                member.left = `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                setPoytakirja(pkc);
              }}
            >
              <IconClock size="xs" />
            </ActionIcon>
          }
        />
      </td>
      <td>
        <ActionIcon
          color="red"
          onClick={() => {
            poytakirja.other.splice(
              poytakirja.other.map((i) => i.name).indexOf(member.name),
              1
            );
            setPoytakirja(pkc);
          }}
        >
          <IconX size={18} />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <>
      <h1>Paikallaolijat</h1>
      <h2>Nuorisovaltuutetut</h2>
      <ScrollArea>
        <Table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Rooli</th>
              <th>Paikalla</th>
              <th>Liittyi myöhässä</th>
              <th>Poistui paikalta</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      <h2>Muut paikallaolleet</h2>
      <ScrollArea>
        <Table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Rooli</th>
              <th>Liittyi myöhässä</th>
              <th>Poistui paikalta</th>
              <th>Luo/poista</th>
            </tr>
          </thead>
          <tbody>
            {rowsOther}
            <td>
              <TextInput
                value={newName}
                onChange={(event) => setNewName(event.currentTarget.value)}
                placeholder="Nimi"
              />
            </td>
            <td>
              <TextInput
                value={newRole}
                onChange={(event) => setNewRole(event.currentTarget.value)}
                placeholder="Rooli"
              />
            </td>
            <td>
              <TextInput
                sx={{ minWidth: "150px" }}
                value={newLate}
                onChange={(event) => setNewLate(event.currentTarget.value)}
                placeholder="15:18"
                pattern="\d\d:\d\d"
                maxLength={5}
              />
            </td>
            <td>
              <TextInput
                sx={{ minWidth: "150px" }}
                value={newLeft}
                onChange={(event) => setNewLeft(event.currentTarget.value)}
                placeholder="16:12"
                pattern="\d\d:\d\d"
                maxLength={5}
              />
            </td>
            <td>
              <ActionIcon
                color="green"
                onClick={() => {
                  poytakirja.other.push({
                    name: newName,
                    role: newRole,
                    joinedLate: newLate === "" ? undefined : newLate,
                    left: newLeft === "" ? undefined : newLeft,
                  });
                  setNewName("");
                  setNewRole("");
                  setNewLate("");
                  setNewLeft("");
                  setPoytakirja(pkc);
                }}
              >
                <IconPlus size={18} />
              </ActionIcon>
            </td>
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
