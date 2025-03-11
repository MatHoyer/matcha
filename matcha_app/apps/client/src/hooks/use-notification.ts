import { TNotificationsOtherUserSchema } from '@matcha/common';
import { useState } from 'react';

export function useSetNotification() {
  const [notifications, setNotifications] = useState<
    TNotificationsOtherUserSchema[]
  >([]);

  return { notifications, setNotifications };
}
