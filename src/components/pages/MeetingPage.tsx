import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import {
  Accordion,
  Button,
  Flex,
  SegmentedControl,
  createStyles,
  rem,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useListState } from "@mantine/hooks";
import ItemCard from "@/components/ItemCard";
import { forcedFirst } from "@/config";
import MeetingInfoCard from "@/components/MeetingInfoCard";

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex",
    alignItems: "center",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    justifyContent: "space-between",
    borderRadius: "1rem",
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: rem(30),
    fontWeight: 700,
    width: rem(60),
    flexShrink: 0,
  },

  itemBody: {
    paddingLeft: theme.spacing.md,
    display: "flex",
    alignItems: "center",
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[9],
    paddingRight: theme.spacing.sm,
  },
}));

const DEFAULT_ITEM_COUNT = forcedFirst.length;

export default function MeetingPage({
  meeting,
  setMeeting,
}: {
  meeting: Meeting;
  setMeeting: (meeting: Meeting) => void;
}) {
  const { classes, cx } = useStyles();
  const [mode, setMode] = useState("draft");

  const [state, handlers] = useListState<MeetingItem>(meeting.items);
  const [forcedFirstState, forcedFirstHandlers] = useListState<MeetingItem>(
    meeting.forcedFirst,
  );
  const [forcedLastState, forcedLastHandlers] = useListState<MeetingItem>(
    meeting.forcedLast,
  );

  useEffect(() => {
    meeting.items = state;
    meeting.forcedFirst = forcedFirstState;
    meeting.forcedLast = forcedLastState;
    setMeeting(meeting);
  }, [state, forcedFirstState, forcedLastState]);

  const [openItem, setOpenItem] = useState<string | null>(null);

  const draggableItems = state.map((item, index) => (
    <Draggable key={index} index={index} draggableId={"draggable-" + index}>
      {(provided, snapshot) => (
        <ItemCard
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          classes={classes}
          dragVisible
          index={DEFAULT_ITEM_COUNT + index + 1}
          provided={provided}
          item={item}
          setItem={(item) => handlers.setItem(index, item)}
          isMinutesMode={mode === "minutes"}
        />
      )}
    </Draggable>
  ));

  const forcedFirstItems = forcedFirstState.map((item, index) => (
    <ItemCard
      className={classes.item}
      classes={classes}
      item={item}
      dragVisible={false}
      index={index + 1}
      provided={{}}
      key={index}
      setItem={(item) => forcedFirstHandlers.setItem(index, item)}
      isMinutesMode={mode === "minutes"}
    />
  ));

  const forcedLastItems = forcedLastState.map((item, index) => (
    <ItemCard
      className={classes.item}
      classes={classes}
      item={item}
      dragVisible={false}
      index={index + forcedFirst.length + state.length + 1}
      provided={{}}
      key={index}
      setItem={(item) => forcedLastHandlers.setItem(index, item)}
      isMinutesMode={mode === "minutes"}
    />
  ));

  const createNewItem = () => {
    handlers.append({
      title: "",
      information: "",
      decision: "",
      meetingNotes: "",
      presentation: "",
      isSecret: false,
    });
    setOpenItem(`${state.length - 1}`);
  };

  return (
    <>
      <Head>
        <title>Kokoustin²</title>
        <meta
          name="description"
          content="Toisen sukupolven pöytäkirja-applikaatio."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Dashboard meeting={meeting}>
        <Flex align="center" justify="center" direction={"column"} mb="md">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            size="md"
            data={[
              { label: "Asialista", value: "draft" },
              { label: "Pöytäkirja", value: "minutes" },
            ]}
          />
        </Flex>

        <Accordion variant="filled" value={openItem} onChange={setOpenItem}>
          <MeetingInfoCard
            meeting={meeting}
            updateMeeting={(meeting) => {
              setMeeting({ ...meeting });
            }}
            classes={classes}
            isMinutesMode={mode === "minutes"}
          />
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              console.log(source.index);
              console.log(destination);
              handlers.reorder({
                from: source.index,
                to: destination?.index || 0,
              });
            }}
            onDragStart={() => setOpenItem(null)}
          >
            {forcedFirstItems}
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {draggableItems}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {mode === "draft" && (
              <Flex justify={"center"} align="center">
                <Button
                  variant="outline"
                  radius="md"
                  mb="0.75rem"
                  mt="1rem"
                  onClick={createNewItem}
                >
                  Luo uusi käsiteltävä asia
                </Button>
              </Flex>
            )}
            {forcedLastItems}
          </DragDropContext>
        </Accordion>
      </Dashboard>
    </>
  );
}
