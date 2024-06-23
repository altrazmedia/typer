import { createContext, useState, useContext, ReactNode } from "react";
import type { ToastNotificationParams, ToastNotification } from "../types";

interface NotificationsContextType {
  notifications: ToastNotification[];
  displayNotification: (notification: ToastNotificationParams) => void;
  hideNotification: (id: number) => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  displayNotification() {},
  hideNotification() {},
});

const NOTIFICATION_DISPLAY_TIME = 2000;
const NOTIFICATION_REMOVAL_DELAY = 600; // must be higher than animation time

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const hideAfterDelay = (id: number) => {
    setTimeout(() => {
      hideNotification(id);
    }, NOTIFICATION_DISPLAY_TIME);
  };

  const removeAfterDelay = (id: number) => {
    setTimeout(() => {
      setNotifications((state) => state.filter((notification) => notification.id !== id));
    }, NOTIFICATION_REMOVAL_DELAY);
  };

  const displayNotification = (notification: ToastNotificationParams) => {
    const id = Date.now();
    setNotifications((state) => [...state, { ...notification, id, isVisible: true }]);
    hideAfterDelay(id);
  };

  const hideNotification = (id: number) => {
    setNotifications((state) =>
      state.map((notification) => (notification.id === id ? { ...notification, isVisible: false } : notification))
    );
    removeAfterDelay(id);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, displayNotification, hideNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsContext must be used within a NotificationsProvider.");
  }
  return context;
};
