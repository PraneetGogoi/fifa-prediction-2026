import './globals.css';
import NavBar from '@/components/NavBar';
import ParticleBackground from '@/components/ParticleBackground';
import BootLoader from '@/components/BootLoader';
import CommandPalette from '@/components/CommandPalette';
import AIAssistant from '@/components/AIAssistant';

export const metadata = {
  title: 'FIFA WC 2026 — Prediction Dashboard',
  description: 'AI-powered prediction dashboard for FIFA World Cup 2026, featuring XGBoost, LightGBM, and Random Forest ensemble models.',
  keywords: 'FIFA, World Cup 2026, prediction, machine learning, football',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ paddingTop: '80px' }}>
        <BootLoader />
        <CommandPalette />
        <AIAssistant />
        <ParticleBackground />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
