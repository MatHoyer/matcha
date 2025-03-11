import { TNotificationsOtherUserSchema } from '@matcha/common/src/schemas/api/notifications.schema';
import { createContext, useState, useContext, ReactNode } from 'react';

// context for showing notification bubble
type NotificationContextType = {
  showBubble: boolean;
  setShowBubble: (value: boolean) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [showBubble, setShowBubble] = useState(() => {
    return JSON.parse(localStorage.getItem('showBubble') || 'false');
  });
  return (
    <NotificationContext.Provider value={{ showBubble, setShowBubble }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
