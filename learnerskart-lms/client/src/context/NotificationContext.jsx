import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Load notification history
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get('/notifications/me');
          if (res.data.success) {
            setNotifications(res.data.notifications);
          }
        } catch (err) {
          console.error('Failed to load notifications history:', err.message);
        }
      };
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Handle Socket.io setup
  useEffect(() => {
    if (user) {
      // Connect socket
      const socketUrl = window.location.origin; // Same origin via proxy
      const newSocket = io(socketUrl);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Realtime notification socket connected');
        newSocket.emit('join-room', user.id);
      });

      // Listen for notifications
      newSocket.on('notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        toast(notif.title, {
          icon: '🔔',
          duration: 4000,
          style: {
            background: '#0a3d91',
            color: '#fff',
            border: '1px solid #fff'
          }
        });
      });

      // Listen for live session start alerts
      newSocket.on('live-session-start', (sessionData) => {
        toast(`🔴 Class Live Now: "${sessionData.topic}". Click to join!`, {
          duration: 10000,
          icon: '🎥',
          onClick: () => {
            if (sessionData.meetingLink) {
              window.open(sessionData.meetingLink, '_blank');
            }
          },
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const markRead = async (id) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await api.patch('/notifications/read-all');
      if (res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, socket }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
