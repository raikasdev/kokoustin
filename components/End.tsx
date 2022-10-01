import { ActionIcon, Select, TextInput } from "@mantine/core";
import { IconClock } from "@tabler/icons";
import { useState } from "react";

export function End({ poytakirja, setPoytakirja, index }: { poytakirja: Poytakirja, setPoytakirja: (value: Poytakirja) => void, index: number }) {
  const pkc = { ...poytakirja };
  return (
    <>
      <h2>{index}. Seuraava kokous</h2>
      <TextInput value={poytakirja.nextMeeting} onChange={(event) => {
        pkc.nextMeeting = event.currentTarget.value as any;
        setPoytakirja(pkc);
      }} label="Seuraava kokous on:" sx={{
          '@media (min-width: 1000px)': {
            width: '20%'
          },
        }} placeholder="Päivämäärä, 1.8.2020 muodossa" />
      <h2>{index + 1}. Kokouksen päättäminen</h2>
      <TextInput value={poytakirja.closeTime} onChange={(event) => {
        pkc.closeTime = event.currentTarget.value as any;
        setPoytakirja(pkc);
      }} placeholder="15:18" pattern="\d\d:\d\d" maxLength={5} sx={{
          '@media (min-width: 1000px)': {
            width: '20%'
          },
        }} label="Puheenjohtaja päätti kokouksen klo" rightSection={<ActionIcon onClick={() => {
          pkc.closeTime = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`;
          setPoytakirja(pkc);
        }}><IconClock size="xs" /></ActionIcon>} />
    </>
  )
}