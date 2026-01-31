import React, { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const notifications = JSON.parse(localStorage.getItem('yj_hub_notifications') || '[]');
    setCount(notifications.filter((n: any) => !n.read).length);
  }, []);

  const addNotification = (text: string) => {
    const notifications = JSON.parse(localStorage.getItem('yj_hub_notifications') || '[]');
    notifications.unshift({ id: Date.now(), text, read: false, createdAt: new Date().toISOString() });
    localStorage.setItem('yj_hub_notifications', JSON.stringify(notifications));
    setCount(count + 1);
  };

  const markAllRead = () => {
    const notifications = JSON.parse(localStorage.getItem('yj_hub_notifications') || '[]');
    const updated = notifications.map((n: any) => ({ ...n, read: true }));
    localStorage.setItem('yj_hub_notifications', JSON.stringify(updated));
    setCount(0);
  };

  const getNotifications = () => {
    return JSON.parse(localStorage.getItem('yj_hub_notifications') || '[]');
  };

  return { count, addNotification, markAllRead, getNotifications };
};

interface Props {
  count: number;
}

const NotificationBadge: React.FC<Props> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default NotificationBadge;
