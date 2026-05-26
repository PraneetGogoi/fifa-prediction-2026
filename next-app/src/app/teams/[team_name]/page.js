'use client';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TEAMS } from '@/data/dashboardData';
import AnimatedNumber from '@/components/AnimatedNumber';
import TypewriterInsight from '@/components/TypewriterInsight';
import { TacticalBoard, RadarChart } from '@/components/IntelSidebar';
import PlayerRadar from '@/components/PlayerRadar';
import SquadRoster from '@/components/SquadRoster';
import FanSentiment from '@/components/FanSentiment';
import styles from './TeamDetail.module.css';

export default function TeamDetail({ params }) {
  const unwrappedParams = use(params);
  const teamNameParam = unwrappedParams.team_name;
  
  const team = TEAMS.find(t => t.name.toLowerCase() === teamNameParam.toLowerCase());

  if (!team) {
    return (
      <div className={styles.container}>
        <div className={styles.notfound}>TEAM NOT FOUND IN DATABASE</div>
        <Link href="/teams" className={styles.backBtn}>← RETURN TO DATABASE</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/teams" className={styles.backBtn}>← BACK TO DATABASE</Link>

      <motion.div className={styles.hero} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className={styles.title}>{team.name}</h1>
          <div className={styles.conf}>CONFEDERATION: {team.conf}</div>
        </div>
        <div className={styles.probBadge}>
          <span className={styles.probVal}>
            <AnimatedNumber value={team.prob * 100} decimals={1} suffix="%" />
          </span>
          <span className={styles.probLabel}>WIN PROBABILITY</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{ marginTop: '32px' }}>
          <TypewriterInsight teamName={team.name} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '48px', alignItems: 'start' }}>
          <div className="hover-float" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <TacticalBoard activeTeam={team.name} />
          </div>
          <div className="hover-float" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <RadarChart activeTeam={team.name} />
          </div>
        </div>

        {team.keyPlayers && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px', borderBottom: '1px solid rgba(0, 225, 255, 0.3)', paddingBottom: '12px' }}>
              KEY IMPACT PLAYERS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {team.keyPlayers.map(player => (
                <PlayerRadar key={player.name} player={player} />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <div className={styles.statsGrid}>
        <motion.div className={styles.statBox} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <span className={styles.statBoxLabel}>Neural Rating</span>
          <span className={styles.statBoxVal}>{team.rating.toFixed(1)}/90</span>
        </motion.div>

        <motion.div className={styles.statBox} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <span className={styles.statBoxLabel}>Historical Win Rate</span>
          <span className={styles.statBoxVal}>{(team.wr * 100).toFixed(0)}%</span>
        </motion.div>

        <motion.div className={styles.statBox} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <span className={styles.statBoxLabel}>Recent Form Index</span>
          <span className={styles.statBoxVal}>{team.form}/10</span>
        </motion.div>

        <motion.div className={styles.statBox} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <span className={styles.statBoxLabel}>Squad Market Value</span>
          <span className={styles.statBoxVal}>€{team.mv}M</span>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '48px' }}>
        <SquadRoster teamName={team.name} />
        <FanSentiment teamName={team.name} />
      </div>

    </div>
  );
}
