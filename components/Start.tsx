import { ActionIcon, Select, TextInput } from "@mantine/core";
import { IconClock } from "@tabler/icons";
import { useState } from "react";

export function Start({
  poytakirja,
  setPoytakirja,
  councilMembers,
}: {
  poytakirja: Poytakirja;
  setPoytakirja: (value: Poytakirja) => void;
  councilMembers: CouncilMember[];
}) {
  const pkc = { ...poytakirja };
  console.log(poytakirja.opener);
  console.log(councilMembers.indexOf(poytakirja.opener as any).toString());
  return (
    <>
      <h2>1. Kokouksen avaus</h2>
      <Select
        label="Kokouksen avasi"
        placeholder="Valitse avaaja"
        value={councilMembers
          .map((i) => i.name)
          .indexOf(((poytakirja as any).opener || { name: "" }).name)
          .toString()}
        onChange={(value: string) => {
          pkc.opener = councilMembers[parseInt(value)];
          console.log(value);
          console.log(pkc.opener);
          setPoytakirja(pkc);
        }}
        sx={{
          "@media (min-width: 1000px)": {
            width: "20%",
          },
        }}
        data={councilMembers.map((i, index) => ({
          value: `${index}`,
          label: i.name,
        }))}
      />
      <TextInput
        value={poytakirja.openTime}
        onChange={(event) => {
          pkc.openTime = event.currentTarget.value as any;
          setPoytakirja(pkc);
        }}
        placeholder="15:18"
        pattern="\d\d:\d\d"
        maxLength={5}
        sx={{
          "@media (min-width: 1000px)": {
            width: "20%",
          },
        }}
        label="Kokous avattiin klo"
        rightSection={
          <ActionIcon
            onClick={() => {
              pkc.openTime = `${new Date()
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
    </>
  );
}
