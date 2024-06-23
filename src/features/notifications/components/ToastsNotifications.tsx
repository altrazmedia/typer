import React from "react";
import { useNotifications } from "../context/NotificationsContext";

export const ToastNotifications: React.FC = () => {
  const { notifications, hideNotification } = useNotifications();

  return (
    <div className="toast-end toast toast-top top-16 w-full gap-0 md:w-80">
      {notifications.map((notification) => (
        <div
          className={`mt-2 cursor-pointer ${notification.isVisible ? "animate-toast-in" : "animate-toast-out"}`}
          onClick={() => hideNotification(notification.id)}
          key={notification.id}
        >
          <div
            className={`alert flex-row items-end justify-start px-9 pt-2 md:pt-4 ${
              notification.type === "success" ? "alert-success" : "alert-error"
            }`}
            role="alert"
          >
            {notification.type === "error" && <ErrorIcon />}
            {notification.type === "success" && <SuccessIcon />}
            <span>{notification.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const SuccessIcon: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

const ErrorIcon: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};
