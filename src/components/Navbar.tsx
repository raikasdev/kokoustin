import {
  createStyles,
  Navbar as MantineNavbar,
  TextInput,
  Code,
  UnstyledButton,
  Badge,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconPrinter,
  IconTrash,
  IconTrashX,
  IconTrashXFilled,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  searchCode: {
    fontWeight: 700,
    fontSize: rem(10),
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5),
  },

  collectionLink: {
    display: "block",
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

const links = [
  { icon: IconArrowLeft, label: "Palaa valikkoon" },
  { icon: IconPrinter, label: "Tulosta asialista" },
  { icon: IconPrinter, label: "Tulosta asialista (ei salaisia kohtia)" },
  { icon: IconPrinter, label: "Tulosta pöytäkirja" },
  { icon: IconPrinter, label: "Tulosta pöytäkirja (ei salaisia kohtia)" },
  { icon: IconTrashX, label: "Poista pöytäkirja", color: 'red' }
];

const collections = [
  { emoji: "1.", label: "Sales" },
  { emoji: "2.", label: "Deliveries" },
  { emoji: "3.", label: "Discounts" },
  { emoji: "4.", label: "Profits" },
  { emoji: "5.", label: "Reports" },
  { emoji: "6.", label: "Orders" },
  { emoji: "7.", label: "Events" },
  { emoji: "8.", label: "Debts" },
  { emoji: "9.", label: "Customers" },
];

export function Navbar() {
  const { classes } = useStyles();
  
  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner} style={{ color: link.color }}>
        <link.icon size={20} className={classes.mainLinkIcon} style={{ color: link.color }} stroke={1.5} />
        <span>{link.label}</span>
      </div>
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    <Link
      href="/"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={classes.collectionLink}
      passHref
    >
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
          {collection.emoji}
        </span>{" "}
        {collection.label}
    </Link>
  ));

  return (
    <MantineNavbar
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
    >
      <MantineNavbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </MantineNavbar.Section>

      <MantineNavbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Käsiteltävät asiat
          </Text>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </MantineNavbar.Section>

      <MantineNavbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Käsiteltävät asiat
          </Text>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
