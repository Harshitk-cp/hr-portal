import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
} from "@mantine/core";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

// eslint-disable-next-line react/prop-types
export function UserButton({ image, name, email, icon, ...others }) {
  const { classes } = useStyles();
  const handleClick = () => {
    // navigateTo("/signout");
    window.location.pathname = "/signout";
  };

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || (
          <ArrowRightIcon
            onClick={() => handleClick("/signup")}
            size="0.9rem"
            stroke={1.5}
          />
        )}
      </Group>
    </UnstyledButton>
  );
}
