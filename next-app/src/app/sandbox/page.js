import Sandbox from '@/components/Sandbox';
import styles from './page.module.css';

export default function SandboxPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>What-If Scenario Engine</h1>
        <p className={styles.subtitle}>TWEAK NEURAL NETWORK WEIGHTS & SIMULATE OUTCOMES</p>
      </div>

      <div className={styles.content}>
        <Sandbox />
      </div>
    </main>
  );
}
