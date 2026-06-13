'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Award, 
  Calendar, 
  DollarSign, 
  Play, 
  Sparkles, 
  Laptop, 
  GraduationCap,
  Book,
  Clock
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { getSubjectsByGrade, getSubjectByName, enrollSubject, watchSubject } from '@/app/actions/class';
import styles from './page.module.css';

export default function ClassPage() {
  // State: 0 = "What We Present", 1 = "Choose Your Class", 2 = "Grade Subjects", 3 = "Subject Details"
  const [step, setStep] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState(null);

  const handleStartNow = () => {
    setStep(1);
  };

  const handleSelectGrade = async (grade) => {
    setSelectedGrade(grade);
    setLoading(true);
    setStep(2);
    try {
      const fetchedSubjects = await getSubjectsByGrade(grade);
      setSubjects(fetchedSubjects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubject = async (subjectName) => {
    setSelectedSubject(subjectName);
    setLoading(true);
    try {
      const details = await getSubjectByName(subjectName);
      if (details) {
        setSubjectDetails(details);
        setStep(3);
      } else {
        alert(`${subjectName} details are not available in the database yet!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!subjectDetails) return;
    try {
      const res = await enrollSubject(subjectDetails.id);
      if (res?.error) {
        alert(res.error);
      } else {
        alert('Successfully Enrolled in Class!');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during enrollment.');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.container}>
      {step > 0 && (
        <button className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      )}

      {/* STEP 0: WHAT WE PRESENT */}
      {step === 0 && (
        <div className="animate-fade-in">
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>EDUWEAVER BENEFITS</p>
            <h1 className={styles.mainTitle}>What We Present</h1>
          </div>

          <div className={styles.presentGrid}>
            <div className={styles.presentCard}>
              <div>
                <div className={styles.cardIcon}>
                  <Laptop size={40} />
                </div>
                <p className={styles.cardTag}>CLASS ROOMS</p>
                <h3 className={styles.cardTitle}>Learn From Home</h3>
                <p className={styles.cardDesc}>
                  Experience class in a whole new interactive environment, combining comfort and high quality.
                </p>
              </div>
            </div>

            <div className={styles.presentCard}>
              <div>
                <div className={styles.cardIcon}>
                  <Users size={40} />
                </div>
                <p className={styles.cardTag}>GREAT TEACHERS</p>
                <h3 className={styles.cardTitle}>Interactive Staff</h3>
                <p className={styles.cardDesc}>
                  Learn from top-tier professional tutors and subject matter experts chosen specifically for you.
                </p>
              </div>
            </div>

            <div className={styles.presentCard}>
              <div>
                <div className={styles.cardIcon}>
                  <BookOpen size={40} />
                </div>
                <p className={styles.cardTag}>CLASS</p>
                <h3 className={styles.cardTitle}>Full Curriculum</h3>
                <p className={styles.cardDesc}>
                  In-depth explanation and resources tailored for all levels of high school curriculum.
                </p>
              </div>
            </div>

            <div className={styles.presentCard}>
              <div>
                <div className={styles.cardIcon}>
                  <Award size={40} />
                </div>
                <p className={styles.cardTag}>EVENTS</p>
                <h3 className={styles.cardTitle}>Student Follow-Up</h3>
                <p className={styles.cardDesc}>
                  Constant checks, active homework grading, and parent follow-up to guarantee success.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={styles.startNowBtn} onClick={handleStartNow}>
              START NOW
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: CHOOSE YOUR CLASS */}
      {step === 1 && (
        <div className="animate-fade-in">
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>ACADEMIC YEARS</p>
            <h1 className={styles.mainTitle}>Choose Your Class</h1>
          </div>

          <div className={styles.gradesGrid}>
            <div className={styles.gradeCard}>
              <div className={styles.gradeIconWrapper}>
                <GraduationCap size={36} />
              </div>
              <h3 className={styles.gradeTitle}>First Grade</h3>
              <p className={styles.gradeDesc}>
                Start your high school path with highly structure curriculum in basic languages and science.
              </p>
              <button 
                className={styles.learnMoreBtn}
                onClick={() => handleSelectGrade('First Grade')}
              >
                LEARN MORE
              </button>
            </div>

            <div className={styles.gradeCard}>
              <div className={styles.gradeIconWrapper}>
                <GraduationCap size={36} />
              </div>
              <h3 className={styles.gradeTitle}>Second Grade</h3>
              <p className={styles.gradeDesc}>
                Advance further. Perfecting core technical and literal directions with focused test preparations.
              </p>
              <button 
                className={styles.learnMoreBtn}
                onClick={() => handleSelectGrade('Second Grade')}
              >
                LEARN MORE
              </button>
            </div>

            <div className={styles.gradeCard}>
              <div className={styles.gradeIconWrapper}>
                <GraduationCap size={36} />
              </div>
              <h3 className={styles.gradeTitle}>Third Grade</h3>
              <p className={styles.gradeDesc}>
                The ultimate final year, with fully optimized tracking, mock exams, and premium lectures.
              </p>
              <button 
                className={styles.learnMoreBtn}
                onClick={() => handleSelectGrade('Third Grade')}
              >
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: CHOOSE SUBJECT */}
      {step === 2 && (
        <div className="animate-fade-in">
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>{selectedGrade}</p>
            <h1 className={styles.mainTitle}>Grade Subjects</h1>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading subjects...</p>
          ) : subjects.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No subjects found for this grade yet.</p>
          ) : (
            <div className={styles.subjectsGrid}>
              {subjects.map((sub) => (
                <div 
                  key={sub.id} 
                  className={styles.subjectCard}
                  onClick={() => handleSelectSubject(sub.name)}
                >
                  <div className={styles.subjectIcon}>
                    <Book size={24} />
                  </div>
                  <h3 className={styles.subjectTitle}>{sub.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: SUBJECT DETAILS */}
      {step === 3 && subjectDetails && (
        <div className="animate-fade-in">
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>SUBJECT OVERVIEW</p>
            <h1 className={styles.mainTitle}>{subjectDetails.name}</h1>
          </div>

          <div className={styles.subjectDetailLayout}>
            <div className={styles.detailInfo}>
              <div>
                <h2 className={styles.teacherName}>{subjectDetails.teacher}</h2>
                <p className={styles.detailDesc}>{subjectDetails.description}</p>
                
                <div className={styles.metaInfoGroup}>
                  <div className={styles.metaCard}>
                    <div className={styles.metaIcon}>
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className={styles.metaLabel}>Lecture date</p>
                      <p className={styles.metaValue}>{subjectDetails.lecture_date}</p>
                    </div>
                  </div>

                  <div className={styles.metaCard}>
                    <div className={styles.metaIcon}>
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className={styles.metaLabel}>Price</p>
                      <p className={styles.metaValue}>{subjectDetails.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.actionBtnGroup}>
                <button className={styles.enrollBtn} onClick={handleEnroll}>
                  START NOW
                </button>
                <button className={styles.previewBtn} onClick={async () => {
                  setIsPlaying(true);
                  if (subjectDetails) {
                    await watchSubject(subjectDetails.id);
                  }
                }}>
                  PREVIEW LECTURE
                </button>
              </div>
            </div>

            <div className={styles.mediaSection}>
              <div className={styles.videoWrapper}>
                {!isPlaying ? (
                  <div className={styles.videoPlaceholder} onClick={() => setIsPlaying(true)}>
                    <div className={styles.playBtn}>
                      <Play size={28} fill="white" color="white" />
                    </div>
                    <span className={styles.playLabel}>PLAY COURSE PROMO</span>
                  </div>
                ) : (
                  <ReactPlayer
                    url={subjectDetails.videoUrl}
                    playing={isPlaying}
                    controls={true}
                    width="100%"
                    height="100%"
                    className={styles.videoFrame}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
