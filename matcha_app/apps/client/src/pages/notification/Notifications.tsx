import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getNearDate, notificationsSchemas, TUser } from '@matcha/common';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUrl } from '../../../../common/src/utils/getUrl';
import { useSession } from '../../hooks/useSession';
import { axiosFetch } from '../../lib/fetch-utils/axiosFetch';
import { TNotificationsOtherUserSchema } from '@matcha/common/src/schemas/api/notifications.schema';
import { socket } from '@/lib/socket';
import { set } from 'date-fns';
import { useChatStore } from '@/hooks/use-chat';

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<
    TNotificationsOtherUserSchema[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useSession();
  const navigate = useNavigate();
  const { addChatWindow } = useChatStore();
  const handleChatClick = (otherUser: TUser, userId: number) => {
    addChatWindow(otherUser, userId);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await axiosFetch({
          method: 'POST',
          url: getUrl('api-notifications'),
          schemas: notificationsSchemas,
          data: { userId: session.user!.id },
          handleEnding: {
            cb: (data) => {
              const formattedNotifications = data.notificationsWithUser.map(
                (notification: TNotificationsOtherUserSchema) => ({
                  ...notification,
                  dateTime: new Date(notification.date),
                })
              );
              formattedNotifications.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime()
              );
              // console.log('formatted notif : ', formattedNotifications);
              setNotifications(formattedNotifications);
            },
          },
        });
      } catch (error) {
        console.log(`Error while fetching notifications: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (message: string) => {
    if (message.includes('message')) {
      return <MessageCircle className="w-4 h-4" />;
    }
    if (message.includes('liked')) {
      return <Heart className="w-4 h-4" />;
    }
    if (message.includes('viewed')) {
      return <Eye className="w-4 h-4" />;
    }
    return null;
  };

  const getNotificationLink = (notification: TNotificationsOtherUserSchema) => {
    if (notification.message.includes('message')) {
      return `/chat/${notification.userId}`;
    }
    if (
      notification.message.includes('liked') ||
      notification.message.includes('viewed')
    ) {
      return `/profile/${notification.userId}`;
    }
    return '#';
  };

  const groupedNotifications = notifications.reduce(
    (
      acc: Record<string, TNotificationsOtherUserSchema & { count: number }>,
      notification: TNotificationsOtherUserSchema
    ) => {
      const key = `${notification.userId}-${notification.message}`;
      if (!acc[key]) {
        acc[key] = { ...notification, count: 1 };
      } else {
        acc[key].count += 1;
      }
      return acc;
    },
    {}
  );

  const getMessageNotification = (
    notification: TNotificationsOtherUserSchema
  ) => {
    const userName = notification.otherUser?.name ?? 'unknown user';
    if (notification.message.includes('message')) {
      return (
        <>
          {notification.message}{' '}
          <a
            href={`/profile/${notification.otherUser?.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            {userName}
          </a>
        </>
      );
    }

    if (
      notification.message.includes('liked') ||
      notification.message.includes('viewed')
    ) {
      return (
        <>
          {' '}
          <a
            href={`/profile/${notification.otherUser?.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            {userName}
          </a>{' '}
          {notification.message}
        </>
      );
    }
  };

  useEffect(() => {
    const notificationHandler = (
      newNotification: TNotificationsOtherUserSchema
    ) => {
      setNotifications((prev) => [newNotification, ...prev]);
    };
    socket.on(`notification-${session.user!.id}`, notificationHandler);

    return () => {
      socket.off(`notification-${session.user!.id}`, notificationHandler);
    };
  }, []);

  // const formattedNotifications = Object.values(groupedNotifications);
  const formattedNotifications = notifications;

  return (
    <LayoutContent className="flex flex-col gap-2">
      {formattedNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            'p-4 cursor-pointer',
            notification.read && 'opacity-50'
          )}
          onClick={
            () => {
              if (notification.message.includes('message'))
                handleChatClick(
                  notification.otherUser as TUser,
                  notification.userId as number
                );
              else navigate(getNotificationLink(notification));
            }

            // navigate(getNotificationLink(notification));
            // onClick: () => handleChatClick(otherUser as TUser),
          }
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/MatHoyer.png" />
              </Avatar>

              <div className="flex flex-col text-left">
                <span>
                  {/* {notification.count > 1
                    ? notification.message.replace(
                        'a new message',
                        `${notification.count} new messages`
                      ) +
                      ' ' +
                      notification.otherUser?.name
                    : notification.message + ' ' + notification.otherUser?.name} */}
                  {getMessageNotification(notification)}
                </span>
                <CardDescription>
                  {getNearDate(notification.date)}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center">
              {getIcon(notification.message)}
            </div>
          </div>
        </Card>
      ))}
    </LayoutContent>
  );
};

export const Notifications: React.FC = () => {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Notifications</LayoutTitle>
        <LayoutDescription>What's new</LayoutDescription>
      </LayoutHeader>
      <NotificationsList />
    </Layout>
  );
};
