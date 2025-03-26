import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  updateNotificationSchemas,
} from '@matcha/common';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { axiosFetch } from '../../lib/fetch-utils/axiosFetch';
import { getIcon } from './Notifications-utils';
import { getUrl } from '@matcha/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NavigationProvider } from 'react-day-picker';

const NotificationsList: React.FC = () => {
  const { notifications, setNotifications } = useSetNotification();
  const session = useSession();
  const navigate = useNavigate();
  const { addChatWindow } = useChatStore();
  const handleChatClick = (otherUser: TUser, userId: number) => {
    addChatWindow(otherUser, userId);
  };
  const queryClient = useQueryClient();
  const formattedNotifications = notifications;
  const [selectedType, setSelectedType] = useState('All');
  const filteredNotifications =
    selectedType && selectedType !== 'All'
      ? formattedNotifications.filter(
          (notification) => notification.type === selectedType
        )
      : formattedNotifications;
  const typeNotif = ['All', ...NOTIF_TYPES];

  useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      return await axiosFetch({
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
            setNotifications(formattedNotifications);
            console.log('formattedNotifications : ', formattedNotifications);
          },
        },
      });
    },
  });

  const getNotificationLink = (notification: TNotificationsOtherUserSchema) => {
    return `/profile/${notification.otherUser?.id}`;
  };

  const getMessageNotification = (
    notification: TNotificationsOtherUserSchema
  ) => {
    const userName = notification.otherUser?.name ?? 'unknown user';
    if (notification.type === 'Message' || notification.type === 'Match') {
      return (
        <span>
          {NOTIF_TYPES_MESSAGES[notification.type]}{' '}
          <span
            className="hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (notification.type === 'Match') {
                setReadNotif.mutate({
                  otherUserId: notification.otherUserId as number,
                  type: notification.type,
                });
              }
              navigate(`/profile/${notification.otherUser?.id}`);
            }}
          >
            {userName}
          </span>
        </span>
      );
    }
    if (
      notification.type === 'Like' ||
      notification.type === 'Unlike' ||
      notification.type === 'View'
    ) {
      return (
        <span>
          <span
            className="hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setReadNotif.mutate({
                otherUserId: notification.otherUserId as number,
                type: notification.type,
              });
              navigate(`/profile/${notification.otherUser?.id}`);
            }}
          >
            {userName}
          </span>{' '}
          {NOTIF_TYPES_MESSAGES[notification.type]}
        </span>
      );
    }
  };

  const setReadNotif = useMutation({
    mutationFn: async (params: { otherUserId: number; type: string }) => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-notifications', { type: 'update' }),
        schemas: updateNotificationSchemas,
        data: {
          userId: session.user!.id,
          otherUserId: params.otherUserId,
          type: params.type,
          read: true,
        },
        handleEnding: {
          cb: (data) => {
            // console.log('invalidate query from setReadMessageNotif mutation');
            queryClient.invalidateQueries({
              queryKey: ['notifications'],
            });
          },
        },
      });
    },
  });

  useEffect(() => {
    const notificationHandler = (
      newNotification: TNotificationsOtherUserSchema
    ) => {
      if (
        newNotification.type === 'Unlike' ||
        newNotification.type === 'Match'
      ) {
        queryClient.invalidateQueries({
          queryKey: ['matchUsers'],
        });
      }
      setNotifications((prev) => [newNotification, ...prev]);
    };

    socket.on(`notification-${session.user!.id}`, notificationHandler);
    return () => {
      socket.off(`notification-${session.user!.id}`, notificationHandler);
    };
  }, []);

  return (
    <LayoutContent className="flex flex-col gap-2">
      <div className="flex gap-2 mb-4">
        {typeNotif.map((type) => (
          <Button
            key={type}
            className={cn(selectedType === type ? '' : 'opacity-50')}
            onClick={() => setSelectedType(type)}
          >
            <div className="flex items-center justify-around gap-2">
              {getIcon(type)}
              {type}
            </div>
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
            else {
              setReadNotif.mutate({
                otherUserId: notification.otherUserId as number,
                type: notification.type,
              });
              navigate(getNotificationLink(notification));
            }
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/MatHoyer.png" />
              </Avatar>

              <div className="flex flex-col text-left">
                <span>{getMessageNotification(notification)}</span>
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
