'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, login } from '@/app/actions/auth';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('role', role);

    try {
      if (isLogin) {
        // Log in
        const res = await login(null, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setSuccess('Log in successful! Redirecting...');
          // Give NextAuth time to cookie setup, then redirect
          setTimeout(() => {
            router.push('/account');
            router.refresh();
          }, 1000);
        }
      } else {
        // Register
        const res = await register(null, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setSuccess(res.message);
          setIsLogin(true); // Switch to login state
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoBox}>
            <span className={styles.eduText}>Édu</span>
            <span className={styles.weaverText}>WEAVER</span>
          </div>
          <h2 className={styles.title}>
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className={styles.subtitle}>
            {isLogin 
              ? 'Access your school, classes, and lectures' 
              : 'Create a student or teacher account'
            }
          </p>
        </div>

        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
        {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <input 
                className={styles.input} 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="Sarah Connor"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input 
              className={styles.input} 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder="sarah@eduweaver.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input 
              className={styles.input} 
              type="password" 
              id="password" 
              name="password" 
              required 
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className={styles.label}>Account Role</label>
              <div className={styles.roleSelect}>
                <button
                  type="button"
                  className={`${styles.roleBtn} ${role === 'STUDENT' ? styles.roleBtnActive : ''}`}
                  onClick={() => setRole('STUDENT')}
                >
                  STUDENT
                </button>
                <button
                  type="button"
                  className={`${styles.roleBtn} ${role === 'TEACHER' ? styles.roleBtnActive : ''}`}
                  onClick={() => setRole('TEACHER')}
                >
                  TEACHER
                </button>
              </div>
            </div>
          )}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'LOG IN' : 'SIGN UP')}
          </button>
        </form>

        <div className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span 
            className={styles.toggleLink} 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
          >
            {isLogin ? 'Create one' : 'Log in here'}
          </span>
        </div>
      </div>
    </div>
  );
}
