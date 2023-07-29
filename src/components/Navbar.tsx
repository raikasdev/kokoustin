const items = [
  { label: "Kokouksen avaus" },
  { label: "Työjärjestyksen hyväksyminen" },
  {
    label: "Kokouksen toteaminen lailliseksi ja päätösvaltaiseksi",
  },
  { label: "Pöytäkirjantarkistajien ja ääntenlaskijan valinta" },
  { label: "Diipadaapa" },
  { label: "Lorem impsum" },
  { label: "Muut asiat" },
  { label: "Kokoustiedotteen sisältö" },
  { label: "Kokouksen päätös" },
];

import { useState } from "react";
import {
  createStyles,
  Navbar as MantineNavbar,
  Group,
  Code,
  getStylesRef,
  rem,
  clsx,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core";
import {
  IconCloudShare,
  IconFile,
  IconFileDescription,
  IconArrowLeft,
  IconTrash,
  IconCloudUpload,
} from "@tabler/icons-react";
import Logo from "./Logo";
import Link from "next/link";
import { deleteFromCloud, saveItemToCloud } from "@/cloud-saving";
import { modals } from "@mantine/modals";
import { useRouter } from "next/router";
import { meetingsTable } from "@/database.config";

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    width: "100%",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const data = [
  {
    link: "",
    label: "Tulosta asialista",
    icon: IconFile,
    action: "/api/pdf/agenda",
    hideSecret: false,
  },
  {
    link: "",
    label: "Tulosta asialista (ei salaisia)",
    icon: IconFile,
    action: "/api/pdf/agenda",
    hideSecret: true,
  },
  {
    link: "",
    label: "Tulosta pöytäkirja",
    icon: IconFileDescription,
    action: "/api/pdf/minutes",
    hideSecret: false,
  },
  {
    link: "",
    label: "Tulosta pöytäkirja (ei salaisia)",
    icon: IconFileDescription,
    action: "/api/pdf/minutes",
    hideSecret: true,
  },
  {
    link: "",
    label: "Poista pöytäkirja",
    icon: IconTrash,
    color: "red",
    specialAction: "delete",
  },
];

export default function Navbar({
  visible,
  meeting,
}: {
  visible: boolean;
  meeting: Meeting;
}) {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const router = useRouter();

  const links = data.map((item) => (
    <form action={item.action} method="POST">
      <input name="hide_secret" value={`${item.hideSecret}`} hidden />
      <input name="meeting" value={JSON.stringify(meeting)} hidden />
      <UnstyledButton
        className={cx(classes.link)}
        key={item.label}
        type="submit"
        sx={{
          color: item.color ? theme.colors[item.color][7] : "",
          "&:hover": {
            color: item.color ? theme.colors[item.color][9] : "",
          },
        }}
        onClick={(e) => {
          if (!item.specialAction) return;
          e.preventDefault();

          if (item.specialAction === "delete") {
            modals.openConfirmModal({
              title: "Haluatko varmasti poistaa tämän kokouksen?",
              children: (
                <Text size="sm">
                  Kokous poistetaan paikallisesti, <b>sekä pilvipalvelusta</b>.
                  <br />
                  Toimintoa <b style={{ color: "red" }}>ei voi perua!</b>
                </Text>
              ),
              labels: { confirm: "Poista", cancel: "Peruuta" },
              confirmProps: { color: "red" },
              onConfirm: async () => {
                await meetingsTable.delete(meeting.id);
                await deleteFromCloud(meeting);
                await router.push("/");
              },
            });
          }
        }}
      >
        <item.icon
          className={classes.linkIcon}
          stroke={1.5}
          style={{
            color: "inherit",
          }}
        />
        <span>{item.label}</span>
      </UnstyledButton>
    </form>
  ));

  return (
    <MantineNavbar width={{ sm: 300 }} hidden={!visible} p="md">
      <MantineNavbar.Section grow>
        <Group className={classes.header} position="apart">
          <Logo height={"24px"} />
          <Code sx={{ fontWeight: 700 }}>v{process.env.APP_VERSION}</Code>
        </Group>
        {links}
      </MantineNavbar.Section>

      <MantineNavbar.Section className={classes.footer}>
        <a
          href="#save"
          className={clsx(classes.link, classes.linkActive)}
          onClick={(event) => {
            event.preventDefault();
            saveItemToCloud(meeting);
          }}
        >
          <IconCloudUpload className={classes.linkIcon} stroke={1.5} />
          <span>Tallenna pilveen</span>
        </a>
        <Link href="/" className={classes.link}>
          <IconArrowLeft className={classes.linkIcon} stroke={1.5} />
          <span>Takaisin valikkoon</span>
        </Link>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
