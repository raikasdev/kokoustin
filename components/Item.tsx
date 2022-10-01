import { Group, Select, Textarea, TextInput } from "@mantine/core";
import { useState } from "react";

export function Item({ poytakirja, setPoytakirja, itemIndex }: { poytakirja: Poytakirja, setPoytakirja: (value: Poytakirja) => void, itemIndex: number }) {
  const pkc = { ...poytakirja };
  const item = pkc.items[itemIndex];
  return (
    <>
      <h2>
        <Group sx={{ width: '100%' }}><p>{itemIndex + 2}.</p> <TextInput sx={{ flexGrow: 1 }} value={item.title} onChange={(event) => {
        item.title = event.currentTarget.value;
        setPoytakirja(pkc);
      }} placeholder="Asian nimi"/></Group></h2>
      <Textarea value={item.presention} onChange={(event) => {
        item.presention = event.currentTarget.value as any;
        setPoytakirja(pkc);
      }} label="Pohjaesitys" />
       <Textarea value={item.meeting} onChange={(event) => {
        item.meeting = event.currentTarget.value as any;
        setPoytakirja(pkc);
      }} label="Kokouskeskustelu" />
      <Textarea value={item.decision} onChange={(event) => {
        item.decision = event.currentTarget.value as any;
        setPoytakirja(pkc);
      }} label="Päätös" />
    </>
  )
}