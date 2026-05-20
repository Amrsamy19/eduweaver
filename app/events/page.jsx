'use client';

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import styles from './page.module.css';

export default function EventsPage() {
  const [selectedDay, setSelectedDay] = useState(20); // Defaults to May 20th

  const eventsList = [
    {
      id: 1,
      day: 13,
      hour: '05:00',
      ampm: 'pm',
      title: 'English Live Lecture 1',
      subject: 'ENGLISH',
      teacher: 'Mr. Ahmed',
      duration: '1.5 hrs'
    },
    {
      id: 2,
      day: 20,
      hour: '05:00',
      ampm: 'pm',
      title: 'Relative Clauses - Live Lecture 2',
      subject: 'ENGLISH',
      teacher: 'Mr. Ahmed',
      duration: '1.5 hrs'
    },
    {
      id: 3,
      day: 20,
      hour: '07:30',
      ampm: 'pm',
      title: 'Thermodynamics Q&A - Office Hours',
      subject: 'PHYSICS',
      teacher: 'Dr. Emily',
      duration: '1 hr'
    },
    {
      id: 4,
      day: 23,
      hour: '04:00',
      ampm: 'pm',
      title: 'Organic Compounds Mock Test 1',
      subject: 'CHEMISTRY',
      teacher: 'Dr. John',
      duration: '2 hrs'
    },
    {
      id: 5,
      day: 27,
      hour: '05:00',
      ampm: 'pm',
      title: 'English Live Lecture 3',
      subject: 'ENGLISH',
      teacher: 'Mr. Ahmed',
      duration: '1.5 hrs'
    }
  ];

  const filteredEvents = eventsList.filter(e => e.day === selectedDay);

  // Generate calendar days for May 2026 (starts on a Friday)
  const daysInMonth = 31;
  const startOffset = 5; // Friday offset
  const calendarDays = [];

  for (let i = 1 - startOffset; i <= daysInMonth; i++) {
    calendarDays.push(i > 0 ? i : null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <p className={styles.subTitle}>SCHEDULE</p>
        <h1 className={styles.mainTitle}>Events & Classes</h1>
      </div>

      <div className={styles.layout}>
        {/* LEFT COLUMN: INTERACTIVE CALENDAR */}
        <div>
          <div className={styles.calendarCard}>
            <div className={styles.calHeader}>
              <h3 className={styles.calMonth}>May 2026</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className={styles.calGrid}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className={styles.dayLabel}>{day}</div>
              ))}
              
              {calendarDays.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} />;
                
                const hasEvent = eventsList.some(e => e.day === day);
                const isActive = selectedDay === day;

                return (
                  <div 
                    key={`day-${day}`} 
                    className={`${styles.dayNum} ${isActive ? styles.activeDay : ''} ${hasEvent ? styles.eventDay : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AGENDA */}
        <div>
          <h2 className={styles.agendaHeader}>
            Agenda for May {selectedDay}, 2026
          </h2>

          {filteredEvents.length === 0 ? (
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No classes or events scheduled for this day. Click another day on the calendar.
            </div>
          ) : (
            <div className={styles.agendaList}>
              {filteredEvents.map(e => (
                <div key={e.id} className={styles.agendaItem}>
                  <div className={styles.timeBlock}>
                    <span className={styles.timeHour}>{e.hour}</span>
                    <span className={styles.timeAmPm}>{e.ampm}</span>
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemBadge}>{e.subject}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        <span>{e.duration}</span>
                      </div>
                    </div>
                    <h3 className={styles.itemTitle}>{e.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      <User size={15} />
                      <span>{e.teacher}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
