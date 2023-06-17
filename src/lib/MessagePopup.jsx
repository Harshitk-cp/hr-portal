import { Alert, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";



const MessagePopup = (props) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };
  return (

    showNotification({
      title: 'Default notification',
      message: 'Error',
    })

  );
};

export default MessagePopup;