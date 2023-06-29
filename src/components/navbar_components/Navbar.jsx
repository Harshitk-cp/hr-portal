import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  rem,
  Text,
} from "@mantine/core";
import { PersonIcon } from "@radix-ui/react-icons";
import { LinksGroup } from "./LinksGroup";
import { UserButton } from "./NavbarFooter";

const navData = [
  {
    label: "Dashboard",
    icon: PersonIcon,
    link: "/home",
  },
  {
    label: "Jobs",
    icon: PersonIcon,
    links: [
      { label: "All Jobs", link: "/jobs" },
      { label: "Create Jobs", link: "/" },
    ],
  },
  {
    label: "Applications",
    icon: PersonIcon,
    initiallyOpened: false,
    link: "/applications",
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function NavbarNested() {
  const { classes } = useStyles();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const links = navData.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Navbar height="100%" width={{ sm: 320 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <Text>Application Tracker</Text>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton
          image="https://www.pngmart.com/files/10/User-Account-Person-PNG-Transparent-Image.png"
          name={name}
          email={email}
        />
      </Navbar.Section>
    </Navbar>
  );
}
