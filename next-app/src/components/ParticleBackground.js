'use client';
import { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        particles: {
          color: { value: ["#ff007f", "#00ff88", "#00e1ff", "#FFC900", "#ff3b3b"] },
          links: {
            color: "#ffffff",
            distance: 120,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            direction: "top",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 80,
          },
          opacity: { value: 0.6 },
          shape: { type: ["circle", "triangle", "polygon"] },
          size: { value: { min: 2, max: 5 } },
        },
        detectRetina: true,
      }}
    />
  );
}
