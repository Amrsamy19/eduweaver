'use client';

import { useState } from 'react';
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
import styles from './page.module.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Live English Class Starting Soon',
      message: 'Your live session "Relative Clauses" with Mr. Ahmed is scheduled to start in 15 minutes. Get your notebook ready!',
      time: '15 mins ago',
      type: 'live',
      unread: true
    },
    {
      id: 2,
      title: 'New Physics Lecture Uploaded',
      message: 'Dr. Emily has uploaded a new video lecture: "Introduction to Thermodynamics" under First Grade physics.',
      time: '2 hours ago',
      type: 'lecture',
      unread: true
    },
    {
      id: 3,
      title: 'Chemistry Mock Test Graded',
      message: 'Congratulations! Your mock exam "Organic Compounds Part 1" has been graded. You scored 96/100 (A+).',
      time: '1 day ago',
      type: 'grade',
      unread: false
    },
    {
      id: 4,
      title: 'Upcoming Parent-Teacher Meeting',
      message: 'A monthly follow-up session with your parents and counselors is scheduled for this Wednesday at 6:00 PM.',
      time: '3 days ago',
      type: 'event',
      unread: false
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
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
