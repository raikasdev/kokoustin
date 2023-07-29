import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Box,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import NormalItem from "./NormalItem";

type ItemCardProps = {
  index: number;
  item: MeetingItem;
  dragVisible: boolean;
  className: string;
  provided: any;
  classes: any;
  isMinutesMode: boolean;
  setItem: (item: MeetingItem) => void;
};

export default function ItemCard({
  className,
  item,
  dragVisible,
  provided,
  classes,
  index,
  setItem,
  isMinutesMode,
}: ItemCardProps) {
  const title = item.title === "" ? "Otsikkoa ei asetettu" : item.title;
  const presentation =
    item.presentation === "" ? "Pohjaesitystä ei asetettu" : item.presentation;

  const theme = useMantineTheme();
  return (
    <Box
      sx={{
        borderRadius: theme.radius.md,
        border: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[2]
        }`,
        marginTop: "0.75rem",
      }}
    >
      <Accordion.Item value={`${index}`} sx={{ borderRadius: theme.radius.md }}>
        <div
          className={className}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Accordion.Control>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={classes.itemBody}>
                <Text className={classes.symbol}>{index}.</Text>
                <div>
                  <Text>{title}</Text>
                  <Text color="dimmed" size="sm">
                    {presentation}
                  </Text>
                </div>
              </div>
              <div {...provided.dragHandleProps} className={classes.dragHandle}>
                {dragVisible && (
                  <IconGripVertical size="1.05rem" stroke={1.5} />
                )}
              </div>
            </div>
          </Accordion.Control>
        </div>
        <Accordion.Panel
          sx={{
            backgroundColor:
              theme.colorScheme === "light" ? "white" : "transparent",
            borderRadius: theme.radius.md,
          }}
        >
          <NormalItem
            isMinutesMode={isMinutesMode}
            item={item}
            setItem={setItem}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Box>
  );
}
