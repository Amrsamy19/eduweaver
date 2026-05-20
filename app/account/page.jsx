'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  BookOpen, 
  Video, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  Settings, 
  Plus, 
  Layers,
  CheckCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import styles from './page.module.css';

export default function AccountPage() {
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [view, setView] = useState('dashboard'); // 'dashboard', 'editProfile', 'lecturesList', 'addLecture'

  // Student profile state
  const [studentProfile, setStudentProfile] = useState({
    name: 'Sarah Connor',
    description: 'Highly motivated science and programming enthusiast aiming for top universities.',
    phone: '+201012345678',
    email: 'sarah.connor@eduweaver.com',
    interests: 'Programming, Physics, Astronomy',
    gender: 'Female',
    grade: 'Third Grade'
  });

  // Teacher profile state
  const [teacherProfile, setTeacherProfile] = useState({
    name: 'Mr. Ahmed',
    description: 'Expert senior English instructor with 15+ years of high school teaching experience.',
    phone: '+201198765432',
    email: 'ahmed.english@eduweaver.com',
    lectureDate: 'Every Wednesday',
    price: '170 L.E / Month',
    subject: 'English'
  });

  // Lectures state
  const [lectures, setLectures] = useState([
    { id: 1, title: 'English Grammar Basics - Lecture 1', date: 'Wednesday, May 13', status: 'Old' },
    { id: 2, title: 'Vocabulary & Comprehension - Lecture 2', date: 'Wednesday, May 20', status: 'Old' }
  ]);

  const [newLecture, setNewLecture] = useState({ title: '', date: '' });

  // Handle forms
  const handleSaveStudent = (e) => {
    e.preventDefault();
    setView('dashboard');
    alert('Student profile saved successfully!');
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    setView('dashboard');
    alert('Teacher profile saved successfully!');
  };

  const handleAddLecture = (e) => {
    e.preventDefault();
    if (!newLecture.title || !newLecture.date) return;
    const added = {
      id: lectures.length + 1,
      title: newLecture.title,
      date: newLecture.date,
      status: 'Add'
    };
    setLectures([added, ...lectures]);
    setView('lecturesList');
    setNewLecture({ title: '', date: '' });
    alert('Lecture added successfully!');
  };

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      {view === 'dashboard' && (
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <p className={styles.subTitle}>DASHBOARD</p>
            <h1 className={styles.mainTitle}>ACCOUNT</h1>
          </div>

          <div className={styles.roleToggle}>
            <button 
              className={`${styles.toggleBtn} ${role === 'student' ? styles.toggleBtnActive : ''}`}
              onClick={() => setRole('student')}
            >
              STUDENT
            </button>
            <button 
              className={`${styles.toggleBtn} ${role === 'teacher' ? styles.toggleBtnActive : ''}`}
              onClick={() => setRole('teacher')}
            >
              TEACHER
            </button>
          </div>
        </div>
      )}

      {view !== 'dashboard' && (
        <button 
          className={styles.backBtn}
          onClick={() => {
            if (view === 'addLecture') setView('lecturesList');
            else setView('dashboard');
          }}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <div>
          {/* PROFILE SUMMARY CARD */}
          <div className={styles.profileCard}>
            <div className={styles.profileDetails}>
              <div className={styles.avatar}>
                {(role === 'student' ? studentProfile.name : teacherProfile.name).charAt(0)}
              </div>
              <div className={styles.nameGroup}>
                <span className={styles.profileRoleBadge}>{role} account</span>
                <h2 className={styles.profileName}>
                  {role === 'student' ? studentProfile.name : teacherProfile.name}
                </h2>
                <p className={styles.profileDesc}>
                  {role === 'student' ? studentProfile.description : teacherProfile.description}
                </p>
              </div>
            </div>
            <button className={styles.editBtn} onClick={() => setView('editProfile')}>
              EDIT PROFILE
            </button>
          </div>

          {/* GRID OF DASHBOARD ITEMS */}
          {role === 'student' ? (
            <div className={styles.dashboardGrid}>
              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Bell size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening notifications settings...')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Notifications</h3>
                  <p className={styles.cardCount}>3 unread announcements</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <BookOpen size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening courses management...')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Courses</h3>
                  <p className={styles.cardCount}>4 active enrollments</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Video size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening classroom settings...')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Classroom</h3>
                  <p className={styles.cardCount}>English - Next live at 5:00 PM</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Calendar size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening events planner...')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Events</h3>
                  <p className={styles.cardCount}>2 tests scheduled this week</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.dashboardGrid}>
              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Video size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => setView('lecturesList')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Lectures</h3>
                  <p className={styles.cardCount}>{lectures.length} total lectures uploaded</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <BookOpen size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening courses setup...')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Courses</h3>
                  <p className={styles.cardCount}>Teaching 1 active subject ({teacherProfile.subject})</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Layers size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening classroom settings...')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Classroom</h3>
                  <p className={styles.cardCount}>142 students registered</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Calendar size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening teacher planner...')}>
                    EDIT
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Events</h3>
                  <p className={styles.cardCount}>Next live Q&A session: Wednesday</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: EDIT PROFILE */}
      {view === 'editProfile' && (
        <div>
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>MANAGE SETTINGS</p>
            <h1 className={styles.mainTitle}>EDIT PROFILE</h1>
          </div>

          {role === 'student' ? (
            <form onSubmit={handleSaveStudent} className={styles.editProfileLayout}>
              <div>
                <h3 className={styles.formSectionTitle}>Personal Details</h3>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={studentProfile.name}
                    onChange={(e) => setStudentProfile({...studentProfile, name: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>About / Description</label>
                  <textarea 
                    className={styles.textarea} 
                    value={studentProfile.description}
                    onChange={(e) => setStudentProfile({...studentProfile, description: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Grade</label>
                  <select 
                    className={styles.select}
                    value={studentProfile.grade}
                    onChange={(e) => setStudentProfile({...studentProfile, grade: e.target.value})}
                  >
                    <option value="First Grade">First Grade</option>
                    <option value="Second Grade">Second Grade</option>
                    <option value="Third Grade">Third Grade</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className={styles.formSectionTitle}>Contact & Preferences</h3>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input 
                    type="tel" 
                    className={styles.input} 
                    value={studentProfile.phone}
                    onChange={(e) => setStudentProfile({...studentProfile, phone: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>E-Mail Address</label>
                  <input 
                    type="email" 
                    className={styles.input} 
                    value={studentProfile.email}
                    onChange={(e) => setStudentProfile({...studentProfile, email: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Interests</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={studentProfile.interests}
                    onChange={(e) => setStudentProfile({...studentProfile, interests: e.target.value})}
                    placeholder="e.g. Programming, Physics"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Gender</label>
                  <select 
                    className={styles.select}
                    value={studentProfile.gender}
                    onChange={(e) => setStudentProfile({...studentProfile, gender: e.target.value})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className={styles.buttonRow}>
                  <button type="submit" className={styles.saveBtn}>SAVE CHANGES</button>
                  <button type="button" className={styles.actionBtn} onClick={() => alert('Sending verification message to: ' + studentProfile.phone)}>
                    <MessageCircle size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} />
                    SEND MESSAGE
                  </button>
                  <button type="button" className={styles.actionBtn} onClick={() => alert('Sarah\'s overall grade: 98.4% (Rank A+)')}>
                    VIEW GRADES
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveTeacher} className={styles.editProfileLayout}>
              <div>
                <h3 className={styles.formSectionTitle}>Teacher Profile</h3>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Teacher's Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={teacherProfile.name}
                    onChange={(e) => setTeacherProfile({...teacherProfile, name: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Bio Description</label>
                  <textarea 
                    className={styles.textarea} 
                    value={teacherProfile.description}
                    onChange={(e) => setTeacherProfile({...teacherProfile, description: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Syllabus Subject</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={teacherProfile.subject}
                    onChange={(e) => setTeacherProfile({...teacherProfile, subject: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <h3 className={styles.formSectionTitle}>Course Details</h3>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input 
                    type="tel" 
                    className={styles.input} 
                    value={teacherProfile.phone}
                    onChange={(e) => setTeacherProfile({...teacherProfile, phone: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>E-Mail Address</label>
                  <input 
                    type="email" 
                    className={styles.input} 
                    value={teacherProfile.email}
                    onChange={(e) => setTeacherProfile({...teacherProfile, email: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Lecture Date & Time</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={teacherProfile.lectureDate}
                    onChange={(e) => setTeacherProfile({...teacherProfile, lectureDate: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Monthly Sub Price</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={teacherProfile.price}
                    onChange={(e) => setTeacherProfile({...teacherProfile, price: e.target.value})}
                  />
                </div>

                <div className={styles.buttonRow}>
                  <button type="submit" className={styles.saveBtn}>SAVE PROFILE</button>
                  <button type="button" className={styles.actionBtn} onClick={() => alert('Opening subject syllabus preview...')}>
                    PREVIEW
                  </button>
                  <button type="button" className={styles.actionBtn} style={{borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)'}} onClick={() => alert('Subscribed to teacher updates!')}>
                    SUBSCRIBE
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* VIEW: LECTURES LIST (TEACHER) */}
      {view === 'lecturesList' && (
        <div>
          <div className={styles.lecturesHeader}>
            <div>
              <p className={styles.subTitle}>LECTURE ARCHIVE</p>
              <h1 className={styles.mainTitle}>LECTURES</h1>
            </div>
            <button className={styles.addLectureBtn} onClick={() => setView('addLecture')}>
              <Plus size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} />
              ADD LECTURE
            </button>
          </div>

          <div className={styles.lecturesGrid}>
            {lectures.map((lec) => (
              <div key={lec.id} className={styles.lectureCard}>
                <div className={styles.lectureInfo}>
                  <span className={styles.lectureStatus}>{lec.status} LECTURE</span>
                  <h3 className={styles.lectureTitle}>{lec.title}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                    <Clock size={14} />
                    <span>{lec.date}</span>
                  </div>
                </div>
                <div className={styles.lectureActions}>
                  <button className={styles.lectureActionBtn} onClick={() => alert(`Editing lecture: ${lec.title}`)}>
                    EDIT LECTURE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ADD LECTURE (TEACHER) */}
      {view === 'addLecture' && (
        <div style={{maxWidth: '600px'}}>
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>TEACHER CONSOLE</p>
            <h1 className={styles.mainTitle}>ADD LECTURES</h1>
          </div>

          <form onSubmit={handleAddLecture} style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '40px', marginTop: '20px'}}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Lecture Title</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Relative Clauses - Lecture 3"
                value={newLecture.title}
                onChange={(e) => setNewLecture({...newLecture, title: e.target.value})}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Lecture Date / Schedule</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Wednesday, May 27"
                value={newLecture.date}
                onChange={(e) => setNewLecture({...newLecture, date: e.target.value})}
                required
              />
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" className={styles.saveBtn}>PUBLISH LECTURE</button>
              <button type="button" className={styles.actionBtn} onClick={() => setView('lecturesList')}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
