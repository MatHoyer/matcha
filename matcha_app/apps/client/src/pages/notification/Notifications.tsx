import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription } from '@/components/ui/card';
import { useChatStore } from '@/hooks/use-chat';
import { useSetNotification } from '@/hooks/use-notification';
import { socket } from '@/lib/socket';
import { cn } from '@/lib/utils';
import {
  getNearDate,
  NOTIF_TYPES,
  NOTIF_TYPES_MESSAGES,
  notificationsSchemas,
  TNotificationsOtherUserSchema,
  TUser,
} from '@matcha/common';
import {
  Eye,
  Heart,
  HeartOff,
  MessageCircle,
  MessageCircleHeart,
  Rows4,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUrl } from '../../../../common/src/utils/getUrl';
import { useSession } from '../../hooks/useSession';
import { axiosFetch } from '../../lib/fetch-utils/axiosFetch';
import { Button } from 'react-day-picker';

const NotificationsList: React.FC = () => {
  const { notifications, setNotifications } = useSetNotification();
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
          url: getUrl('api-notifications', { type: 'get' }),
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

  const getIcon = (type: string) => {
    if (type === 'All') {
      return <Rows4 className="w-4 h-4" />;
    }
    if (type === 'Message') {
      return <MessageCircle className="w-4 h-4" />;
    }
    if (type === 'Like') {
      return <Heart className="w-4 h-4" />;
    }
    if (type === 'View') {
      return <Eye className="w-4 h-4" />;
    }
    if (type === 'Match') {
      return <MessageCircleHeart className="w-4 h-4" />;
    }
    if (type === 'Unlike') {
      return <HeartOff className="w-4 h-4" />;
    }
    return null;
  };

  const getNotificationLink = (notification: TNotificationsOtherUserSchema) => {
    if (notification.type === 'Message') {
      return `/chat/${notification.userId}`;
    }
    if (notification.type === 'Like' || notification.type === 'View') {
      return `/profile/${notification.userId}`;
    }
    return '#';
  };

  // const groupedNotifications = notifications.reduce(
  //   (
  //     acc: Record<string, TNotificationsOtherUserSchema & { count: number }>,
  //     notification: TNotificationsOtherUserSchema
  //   ) => {
  //     const key = `${notification.userId}-${notification.message}`;
  //     if (!acc[key]) {
  //       acc[key] = { ...notification, count: 1 };
  //     } else {
  //       acc[key].count += 1;
  //     }
  //     return acc;
  //   },
  //   {}
  // );

  const getMessageNotification = (
    notification: TNotificationsOtherUserSchema
  ) => {
    const userName = notification.otherUser?.name ?? 'unknown user';
    if (notification.type === 'Message') {
      return (
        <>
          {NOTIF_TYPES_MESSAGES[notification.type]}{' '}
          <div
            className="hover:inline-block"
            onClick={() => navigate(`/profile/${notification.otherUser?.id}`)}
          >
            {userName}
          </div>
        </>
      );
    }

    if (notification.type === 'Like' || notification.type === 'View') {
      return (
        <>
          {' '}
          {/* <a
            href={`/profile/${notification.otherUser?.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          > */}
          <div
            className="hover:inline-block"
            onClick={() => navigate(`/profile/${notification.otherUser?.id}`)}
          >
            {userName}
          </div>{' '}
          {NOTIF_TYPES_MESSAGES[notification.type]}
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

  const [selectedType, setSelectedType] = useState('All');
  const filteredNotifications =
    selectedType && selectedType !== 'All'
      ? formattedNotifications.filter(
          (notification) => notification.type === selectedType
        )
      : formattedNotifications;
  const typeNotif = ['All', ...NOTIF_TYPES];

  return (
    <LayoutContent className="flex flex-col gap-2">
      <div className="flex gap-2 mb-4">
        {typeNotif.map((type) => (
          <Button
            key={type}
            className={`px-4 py-2 border rounded-2xl ${
              selectedType === type ? '' : 'opacity-50'
            }`}
            onClick={() => setSelectedType(type)}
          >
            <div className=""></div>

            <span className="flex items-center gap-2">
              {getIcon(type)}
              {type}
            </span>
          </Button>
        ))}
      </div>

      {filteredNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            'p-4 cursor-pointer',
            notification.read && 'opacity-50'
          )}
          onClick={() => {
            if (notification.type === 'Message')
              handleChatClick(
                notification.otherUser as TUser,
                notification.userId as number
              );
            else navigate(getNotificationLink(notification));
          }}
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
              {getIcon(notification.type)}
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
