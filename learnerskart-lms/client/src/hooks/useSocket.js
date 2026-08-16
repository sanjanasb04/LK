import { useNotifications } from '../context/NotificationContext';

export default function useSocket() {
  const { socket } = useNotifications();
  return socket;
}
