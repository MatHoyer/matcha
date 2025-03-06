import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import {
  TNotification,
  getNearDate,
  notificationsSchemas,
} from '@matcha/common';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { axiosFetch } from '../lib/fetch-utils/axiosFetch';
import { getUrl } from '../../../common/src/utils/getUrl';
import { useSession } from '../hooks/useSession';
import { MessageCircle, Heart, Eye } from 'lucide-react';
import { TMessage } from '../../../common/dist/schemas/database.schema';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import clsx from 'clsx';

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useSession();
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
              // setNotifications(data.notifications);
              console.log('Notifications:', JSON.stringify(data, null, 2));
              const formattedNotifications = data.notifications.map(
                (notification: TNotification) => ({
                  ...notification,
                  dateTime: new Date(notification.date),
                })
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
  return (
    <LayoutContent className="flex flex-col gap-2">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={clsx('p-4', notification.read && 'bg-gray-500')}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/MatHoyer.png" />
              </Avatar>

              <div className="flex flex-col text-left">
                <span>{notification.message}</span>
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
