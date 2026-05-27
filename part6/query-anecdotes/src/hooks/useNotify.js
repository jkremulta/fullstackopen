import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const useNotify = () => {
  const { notification, setNotification } = useContext(NotificationContext)

  const notify = (message, duration = 5) => {
    setNotification(message)

    setTimeout(() => {
      setNotification('')
    }, duration * 1000)
  }

  return {
    notify,
    notification
  }
}

export default useNotify