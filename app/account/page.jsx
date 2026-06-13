'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getUserProfile, updateProfile } from '@/app/actions/auth';
import { getTeacherAnalytics, getTeacherSubjects, createSubject, deleteSubject } from '@/app/actions/class';
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
  MessageCircle,
  Trash2
} from 'lucide-react';
import styles from './page.module.css';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [view, setView] = useState(searchParams.get('view') || 'dashboard'); // 'dashboard', 'editProfile', 'lecturesList', 'addLecture', 'analytics'

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

  // Analytics & Course state for teachers
  const [analytics, setAnalytics] = useState({ totalViews: 0, enrollmentsCount: 0, studentViews: [] });
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', grade: 'First Grade', description: '', lectureDate: '', price: '', videoUrl: '' });

  // Load user profile details on auth change
  useEffect(() => {
    async function loadProfile() {
      if (session?.user?.email) {
        const user = await getUserProfile(session.user.email);
        if (user) {
          setRole(user.role.toLowerCase());
          if (user.role === 'STUDENT') {
            setStudentProfile({
              name: user.name || '',
              description: user.description || '',
              phone: user.phone || '',
              email: user.email || '',
              interests: user.interests || '',
              gender: user.gender || 'Female',
              grade: user.grade || 'First Grade',
            });
          } else if (user.role === 'TEACHER') {
            setTeacherProfile({
              name: user.name || '',
              description: user.description || '',
              phone: user.phone || '',
              email: user.email || '',
              lectureDate: user.lectureDate || 'Every Wednesday',
              price: user.price || '170 L.E / Month',
              subject: user.subject || 'English',
            });
            
            // Load Analytics & Courses
            const analyticsData = await getTeacherAnalytics();
            setAnalytics(analyticsData);
            
            const subjectsData = await getTeacherSubjects();
            setSubjects(subjectsData);
          }
        }
      }
    }
    if (status === 'authenticated') {
      loadProfile();
    }
  }, [session, status]);

  // Handle forms
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    const res = await updateProfile(session.user.id, {
      name: studentProfile.name,
      description: studentProfile.description,
      phone: studentProfile.phone,
      grade: studentProfile.grade,
      interests: studentProfile.interests,
      gender: studentProfile.gender,
    });
    if (res.success) {
      setView('dashboard');
      alert('Student profile saved successfully!');
    } else {
      alert('Error saving student profile: ' + res.error);
    }
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    const res = await updateProfile(session.user.id, {
      name: teacherProfile.name,
      description: teacherProfile.description,
      phone: teacherProfile.phone,
      lectureDate: teacherProfile.lectureDate,
      price: teacherProfile.price,
      subject: teacherProfile.subject,
    });
    if (res.success) {
      setView('dashboard');
      alert('Teacher profile saved successfully!');
    } else {
      alert('Error saving teacher profile: ' + res.error);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.lectureDate) return;
    
    const res = await createSubject(newSubject);
    if (res.success) {
      alert('Course added successfully!');
      setView('lecturesList');
      setNewSubject({ name: '', grade: 'First Grade', description: '', lectureDate: '', price: '', videoUrl: '' });
      // Refresh subjects
      const updatedSubjects = await getTeacherSubjects();
      setSubjects(updatedSubjects);
    } else {
      alert('Failed to add course: ' + res.error);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (confirm('Are you sure you want to delete this course? Enrolled students will still have access, but it will be hidden from the catalog.')) {
      const res = await deleteSubject(id);
      if (res.success) {
        setSubjects(subjects.filter(s => s.id !== id));
      } else {
        alert('Failed to delete course');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-orange)' }}>LOADING PROFILE...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      {view === 'dashboard' && (
        <div className={styles.header} style={{ justifyContent: 'flex-end' }}>
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
                    <TrendingUp size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => setView('analytics')}>
                    VIEW
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Analytics</h3>
                  <p className={styles.cardCount}>{analytics.totalViews} total course views</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <BookOpen size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => setView('lecturesList')}>
                    MANAGE
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Courses</h3>
                  <p className={styles.cardCount}>{subjects.length} active courses</p>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Layers size={24} />
                  </div>
                  <button className={styles.cardActionBtn} onClick={() => alert('Opening classroom settings...')}>
                    VIEW
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>Enrollments</h3>
                  <p className={styles.cardCount}>{analytics.enrollmentsCount} total student enrollments</p>
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

      {/* VIEW: COURSES LIST (TEACHER) */}
      {view === 'lecturesList' && (
        <div>
          <div className={styles.lecturesHeader}>
            <div>
              <p className={styles.subTitle}>COURSE MANAGEMENT</p>
              <h1 className={styles.mainTitle}>YOUR COURSES</h1>
            </div>
            <button className={styles.addLectureBtn} onClick={() => setView('addLecture')}>
              <Plus size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} />
              ADD COURSE
            </button>
          </div>

          <div className={styles.lecturesGrid}>
            {subjects.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You haven't created any courses yet.</p>
            ) : subjects.map((sub) => (
              <div key={sub.id} className={styles.lectureCard}>
                <div className={styles.lectureInfo}>
                  <span className={styles.lectureStatus}>{sub.grade}</span>
                  <h3 className={styles.lectureTitle}>{sub.name}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                    <Clock size={14} />
                    <span>{sub.lecture_date}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>
                    {sub.views} views
                  </p>
                </div>
                <div className={styles.lectureActions}>
                  <button className={styles.lectureActionBtn} onClick={() => handleDeleteSubject(sub.id)} style={{ color: 'var(--accent-orange)' }}>
                    <Trash2 size={16} style={{marginRight: '6px', verticalAlign: 'middle'}} />
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ADD COURSE (TEACHER) */}
      {view === 'addLecture' && (
        <div style={{maxWidth: '600px'}}>
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>TEACHER CONSOLE</p>
            <h1 className={styles.mainTitle}>CREATE COURSE</h1>
          </div>

          <form onSubmit={handleAddSubject} style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '40px', marginTop: '20px'}}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Course Name</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Advanced Thermodynamics"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Grade</label>
              <select 
                className={styles.select}
                value={newSubject.grade}
                onChange={(e) => setNewSubject({...newSubject, grade: e.target.value})}
              >
                <option value="First Grade">First Grade</option>
                <option value="Second Grade">Second Grade</option>
                <option value="Third Grade">Third Grade</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Course details..."
                value={newSubject.description}
                onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Lecture Schedule</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Wednesday, May 27"
                value={newSubject.lectureDate}
                onChange={(e) => setNewSubject({...newSubject, lectureDate: e.target.value})}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Price (L.E)</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. 150 L.E / Month"
                value={newSubject.price}
                onChange={(e) => setNewSubject({...newSubject, price: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Video URL</label>
              <input 
                type="url" 
                className={styles.input} 
                placeholder="https://youtube.com/..."
                value={newSubject.videoUrl}
                onChange={(e) => setNewSubject({...newSubject, videoUrl: e.target.value})}
              />
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" className={styles.saveBtn}>PUBLISH COURSE</button>
              <button type="button" className={styles.actionBtn} onClick={() => setView('lecturesList')}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: ANALYTICS (TEACHER) */}
      {view === 'analytics' && (
        <div>
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>PERFORMANCE</p>
            <h1 className={styles.mainTitle}>ANALYTICS</h1>
          </div>
          
          <div className={styles.dashboardGrid}>
            <div className={styles.dashboardCard} style={{ background: 'var(--accent-purple)', color: '#fff' }}>
              <div className={styles.cardInfo}>
                <h3 style={{ fontSize: '1.2rem', opacity: 0.8 }}>Total Course Views</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{analytics.totalViews}</p>
              </div>
            </div>
            <div className={styles.dashboardCard} style={{ background: 'var(--accent-orange)', color: '#000' }}>
              <div className={styles.cardInfo}>
                <h3 style={{ fontSize: '1.2rem', opacity: 0.8 }}>Total Enrollments</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{analytics.enrollmentsCount}</p>
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: '40px', fontSize: '1.5rem', marginBottom: '20px' }}>Recent Student Views</h3>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '20px' }}>
            {analytics.studentViews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No student views recorded yet.</p>
            ) : (
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '15px' }}>Student</th>
                    <th style={{ padding: '15px' }}>Course</th>
                    <th style={{ padding: '15px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.studentViews.map((v, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '15px', color: 'var(--text-main)' }}>{v.student_name}</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{v.subject_name}</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{new Date(v.viewed_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
