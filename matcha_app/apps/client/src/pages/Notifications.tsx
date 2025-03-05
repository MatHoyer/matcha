import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // fetch
  }, []);

  //   if (loading) retu  rn <div>Loading notifications...</div>;
  //   if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    //example of a notif card
    <Card className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div>Notification</div>
        <div>Time</div>
      </div>
      <div>Message</div>
    </Card>
  );
};

export const Notifications: React.FC = () => {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Notifications</LayoutTitle>
        <LayoutDescription>What's new</LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        <NotificationsList />
      </LayoutContent>
    </Layout>
  );
};
