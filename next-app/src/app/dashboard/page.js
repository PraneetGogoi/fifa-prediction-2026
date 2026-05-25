'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RankingsSidebar from '@/components/RankingsSidebar';
import TacticalPitch from '@/components/TacticalPitch';
import ChartsPanel from '@/components/ChartsPanel';
import IntelSidebar from '@/components/IntelSidebar';
import Ticker from '@/components/Ticker';
import TrendWidget from '@/components/TrendWidget';
import HeatmapWidget from '@/components/HeatmapWidget';
import LiveInferenceWidget from '@/components/LiveInferenceWidget';
import MatchSimulator from '@/components/MatchSimulator';
import FeatureRadar from '@/components/FeatureRadar';
import TournamentBracket from '@/components/TournamentBracket';
import ValueMatrix from '@/components/ValueMatrix';
import HeadToHead from '@/components/HeadToHead';
import AdminPanel from '@/components/AdminPanel';
import Sandbox from '@/components/Sandbox';

export default function Home() {
  const [activeTeam, setActiveTeam] = useState('Spain');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleTeamSelect = (teamName) => {
    if (teamName === activeTeam) return;
    setIsSyncing(true);
    setActiveTeam(teamName);
    setTimeout(() => setIsSyncing(false), 800);
  };

  return (
    <>
      <Header />
      
      <main style={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingBottom: '160px', // Extra space for the bottom dock
        position: 'relative',
        zIndex: 10
      }}>
        {/* Bento Grid */}
        <section style={{ 
          width: '100%', 
          maxWidth: '1400px', 
          margin: '24px auto', 
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: 'minmax(min-content, auto)',
          gap: '24px',
        }}>
          {/* Hero Pitch (Spans 8 columns) */}
          <div style={{ gridColumn: 'span 8', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <TacticalPitch activeTeam={activeTeam} onTeamSelect={handleTeamSelect} isSyncing={isSyncing} />
          </div>

          {/* Live Inference Widget (Spans 4 columns) */}
          <div style={{ gridColumn: 'span 4' }}>
            <LiveInferenceWidget activeTeam={activeTeam} />
          </div>

          {/* Rankings (Spans 3 columns) */}
          <div style={{ gridColumn: 'span 3', display: 'flex' }}>
            <RankingsSidebar activeTeam={activeTeam} onTeamSelect={handleTeamSelect} />
          </div>

          {/* Charts (Spans 6 columns) */}
          <div style={{ gridColumn: 'span 6', display: 'flex' }}>
            <ChartsPanel activeTeam={activeTeam} onTeamSelect={handleTeamSelect} />
          </div>

          {/* Intel Sidebar (Spans 3 columns) */}
          <div style={{ gridColumn: 'span 3', display: 'flex' }}>
            <IntelSidebar activeTeam={activeTeam} />
          </div>

          {/* New Visualizations Row */}
          <div style={{ gridColumn: 'span 6', display: 'flex' }}>
            <TrendWidget activeTeam={activeTeam} />
          </div>
          
          <div style={{ gridColumn: 'span 6', display: 'flex' }}>
            <HeatmapWidget activeTeam={activeTeam} />
          </div>

          {/* Phase 4 Visualizations Row */}
          <div style={{ gridColumn: 'span 6', display: 'flex' }}>
            <MatchSimulator />
          </div>

          <div style={{ gridColumn: 'span 6', display: 'flex' }}>
            <FeatureRadar activeTeam={activeTeam} onTeamSelect={handleTeamSelect} />
          </div>

          {/* Phase 5 Visualizations Row */}
          <div style={{ gridColumn: 'span 12', display: 'flex' }}>
            <TournamentBracket activeTeam={activeTeam} />
          </div>

          <div style={{ gridColumn: 'span 12', display: 'flex', minHeight: '500px' }}>
            <ValueMatrix activeTeam={activeTeam} />
          </div>

          <div style={{ gridColumn: 'span 12', display: 'flex' }}>
            <HeadToHead activeTeam={activeTeam} />
          </div>

          <div style={{ gridColumn: 'span 12', display: 'flex', marginTop: '20px' }}>
            <AdminPanel />
          </div>

          <div style={{ gridColumn: 'span 12', display: 'flex', marginTop: '20px' }}>
            <Sandbox />
          </div>
        </section>
      </main>

      <Ticker />
    </>
  );
}
