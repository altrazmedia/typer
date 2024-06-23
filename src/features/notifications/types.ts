export interface ToastNotificationParams {
  type: "success" | "error";
  message: string;
}

export interface ToastNotification extends ToastNotificationParams {
  id: number;
  isVisible: boolean;
}
