import { useState } from 'react';
import { TNotificationsOtherUserSchema } from '@matcha/common/src/schemas/api/notifications.schema';

export function useSetNotification() {
  const [notifications, setNotifications] = useState<
    TNotificationsOtherUserSchema[]
  >([]);

  return { notifications, setNotifications };
}
