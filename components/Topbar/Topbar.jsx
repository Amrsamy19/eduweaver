'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { getStudentNotifications } from '@/app/actions/notifications';
import styles from './Topbar.module.css';

export default function Topbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const userPopupRef = useRef(null);
  const notifPopupRef = useRef(null);

  useEffect(() => {
    async function fetchNotifs() {
      if (session?.user?.role === 'STUDENT') {
        const notifs = await getStudentNotifications();
        setNotifications(notifs.filter(n => n.unread).slice(0, 5));
      }
    }
    fetchNotifs();
  }, [session]);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userPopupRef.current && !userPopupRef.current.contains(event.target)) {
        setShowUserPopup(false);
      }
      if (notifPopupRef.current && !notifPopupRef.current.contains(event.target)) {
        setShowNotifPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (!pathname) return '';
    const path = pathname.split('/')[1];
    return path ? path.toUpperCase() : 'DASHBOARD';
  };

  const handleEditProfile = () => {
    setShowUserPopup(false);
    router.push('/account?view=editProfile');
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (!session) return null; // Don't show topbar on login/register if not authed

  const userName = session?.user?.name || 'User';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className={styles.topbar}>
      <div className={styles.pageTitle}>
        {getPageTitle()}
      </div>

      <div className={styles.actions}>
        <div ref={notifPopupRef} style={{ position: 'relative' }}>
          <button 
            className={styles.iconBtn} 
            onClick={() => {
              setShowNotifPopup(!showNotifPopup);
              setShowUserPopup(false);
            }}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className={styles.badge}>{notifications.length}</span>
            )}
          </button>

          {showNotifPopup && (
            <div className={`${styles.popup} ${styles.notificationsPopup}`}>
              <div className={styles.popupHeader}>Notifications</div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No new notifications
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={styles.notificationItem} onClick={() => {
                    setShowNotifPopup(false);
                    router.push('/notifications');
                  }}>
                    <div className={styles.notificationTitle}>{n.title}</div>
                    <div className={styles.notificationTime}>
                      {new Date(n.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
              <button 
                className={styles.popupItem} 
                style={{ justifyContent: 'center', color: 'var(--accent-orange)', borderTop: '1px solid var(--border-color)', marginTop: '5px' }}
                onClick={() => {
                  setShowNotifPopup(false);
                  router.push('/notifications');
                }}
              >
                View All
              </button>
            </div>
          )}
        </div>

        <div ref={userPopupRef} style={{ position: 'relative' }}>
          <button 
            className={styles.userBtn}
            onClick={() => {
              setShowUserPopup(!showUserPopup);
              setShowNotifPopup(false);
            }}
          >
            <div className={styles.avatar}>{initial}</div>
            <span className={styles.userName}>{userName}</span>
          </button>

          {showUserPopup && (
            <div className={styles.popup}>
              <button className={styles.popupItem} onClick={handleEditProfile}>
                <Settings size={16} />
                Edit Profile
              </button>
              <button className={`${styles.popupItem} ${styles.logoutItem}`} onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
