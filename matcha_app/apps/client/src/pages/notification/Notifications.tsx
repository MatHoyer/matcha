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
import {
  TNotification,
  getNearDate,
  notificationsSchemas,
} from '@matcha/common';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUrl } from '../../../../common/src/utils/getUrl';
import { useSession } from '../../hooks/useSession';
import { axiosFetch } from '../../lib/fetch-utils/axiosFetch';

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useSession();
  const navigate = useNavigate();

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
              console.log('Notifications:', JSON.stringify(data, null, 2));
              const formattedNotifications = data.notifications.map(
                (notification: TNotification) => ({
                  ...notification,
                  dateTime: new Date(notification.date),
                })
              );
              formattedNotifications.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime()
              );
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

  const getNotificationLink = (notification: TNotification) => {
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
      acc: Record<string, TNotification & { count: number }>,
      notification: TNotification
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

  const formattedNotifications = Object.values(groupedNotifications);

  return (
    <LayoutContent className="flex flex-col gap-2">
      {formattedNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            'p-4 cursor-pointer',
            notification.read && 'bg-gray-500'
          )}
          onClick={() => {
            navigate(getNotificationLink(notification));
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/MatHoyer.png" />
              </Avatar>

              <div className="flex flex-col text-left">
                <span>
                  {notification.count > 1
                    ? notification.message.replace(
                        'a new message',
                        `${notification.count} new messages`
                      )
                    : notification.message}
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
