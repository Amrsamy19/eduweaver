'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Calendar, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Plus
} from 'lucide-react';
import { getUserTransactions } from '@/app/actions/payments';
import styles from './page.module.css';

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getUserTransactions();
        const formatted = data.map(tx => ({
          id: tx.id,
          date: new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          subject: tx.description,
          amount: tx.amount,
          status: tx.status
        }));
        setTransactions(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const activeSub = {
    course: 'English First Grade Syllabus',
    teacher: 'Mr. Ahmed',
    cost: '170 L.E / Month',
    nextBilling: 'June 10, 2026',
    method: 'Visa ending in 4242'
  };

  const handleDownload = (id) => {
    alert(`Downloading Invoice ${id} PDF...`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <p className={styles.subTitle}>BILLING & TRANSACTIONS</p>
        <h1 className={styles.mainTitle}>Payments</h1>
      </div>

      <div className={styles.layout}>
        {/* LEFT COLUMN: ACTIVE SUBSCRIPTIONS & TRANSACTION HISTORY */}
        <div>
          {/* SUBSCRIPTION BRIEF */}
          <div className={styles.billingCard}>
            <h2 className={styles.billingTitle}>Active Subscription</h2>
            
            <div className={styles.subInfoRow}>
              <span className={styles.rowLabel}>Course / Syllabus</span>
              <span className={styles.rowValue}>{activeSub.course}</span>
            </div>
            
            <div className={styles.subInfoRow}>
              <span className={styles.rowLabel}>Instructor</span>
              <span className={styles.rowValue}>{activeSub.teacher}</span>
            </div>

            <div className={styles.subInfoRow}>
              <span className={styles.rowLabel}>Cost</span>
              <span className={styles.rowValue} style={{ color: 'var(--accent-orange)' }}>{activeSub.cost}</span>
            </div>

            <div className={styles.subInfoRow}>
              <span className={styles.rowLabel}>Next Billing Date</span>
              <span className={styles.rowValue}>{activeSub.nextBilling}</span>
            </div>

            <div className={styles.subInfoRow}>
              <span className={styles.rowLabel}>Payment Method</span>
              <span className={styles.rowValue}>{activeSub.method}</span>
            </div>
          </div>

          {/* TRANSACTION HISTORY */}
          <div className={styles.billingCard}>
            <h2 className={styles.billingTitle}>Transaction History</h2>
            
            <div className={styles.tableWrapper}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th className={styles.th}>Invoice ID</th>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Description</th>
                    <th className={styles.th}>Amount</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className={styles.td} style={{ fontWeight: 700 }}>{tx.id}</td>
                      <td className={styles.td}>{tx.date}</td>
                      <td className={styles.td}>{tx.subject}</td>
                      <td className={styles.td} style={{ fontWeight: 700 }}>{tx.amount}</td>
                      <td className={styles.td}>
                        <span className={`${styles.statusBadge} ${styles.statusPaid}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <button 
                          onClick={() => handleDownload(tx.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-orange)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 700
                          }}
                        >
                          <Download size={14} />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CARD AND SECURITY INFO */}
        <div>
          {/* VIRTUAL CREDIT CARD */}
          <div style={{ marginBottom: '40px' }}>
            <h2 className={styles.billingTitle} style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Primary Payment Method</h2>
            
            <div className={styles.creditCard}>
              <div className={styles.cardTop}>
                <div className={styles.chip} />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, italic: true }}>VISA</span>
              </div>
              
              <div className={styles.cardNum}>
                ••••  ••••  ••••  4242
              </div>
              
              <div className={styles.cardBottom}>
                <div>
                  <div className={styles.holderLabel}>Card Holder</div>
                  <div className={styles.holderName}>Sarah Connor</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={styles.holderLabel}>Expires</div>
                  <div className={styles.holderName}>09 / 29</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY STATEMENT */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', padding: '25px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <ShieldCheck size={28} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Secure Transactions</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                All payments are processed securely via SSL encryption and standard banking systems. Your sensitive card credentials are never saved on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
