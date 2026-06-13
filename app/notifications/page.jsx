'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Video, 
  BookOpen, 
  Award, 
  Calendar, 
  Check, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { getStudentNotifications, markAllNotificationsRead, deleteNotification as deleteNotificationAction } from '@/app/actions/notifications';
import styles from './page.module.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getStudentNotifications();
        const formatted = data.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
          type: n.type,
          unread: n.unread
        }));
        setNotifications(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = async (id) => {
    await deleteNotificationAction(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'live':
        return <Video size={20} />;
      case 'lecture':
        return <BookOpen size={20} />;
      case 'grade':
        return <Award size={20} />;
      case 'event':
        return <Calendar size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p className={styles.subTitle}>INBOX</p>
          <h1 className={styles.mainTitle}>Notifications</h1>
        </div>
        
        {notifications.some(n => n.unread) && (
          <button 
            onClick={markAllRead}
            style={{
              background: 'transparent',
              border: '2px solid var(--accent-orange)',
              color: 'var(--accent-orange)',
              padding: '10px 24px',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ marginBottom: '20px', color: 'var(--accent-orange)' }} />
          <h3>All caught up!</h3>
          <p>No new notifications at this time.</p>
        </div>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`${styles.notificationCard} ${n.unread ? styles.notificationCardUnread : ''}`}
            >
              <div className={styles.iconWrapper}>
                {getIcon(n.type)}
              </div>
              
              <div className={styles.contentWrapper}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    {n.title}
                    {n.unread && <span className={styles.unreadDot} />}
                  </h3>
                  <span className={styles.cardTime}>{n.time}</span>
                </div>
                <p className={styles.cardMessage}>{n.message}</p>
              </div>

              <button 
                onClick={() => deleteNotification(n.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 94, 94, 0.6)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF5E5E'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 94, 94, 0.6)'}
                title="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
