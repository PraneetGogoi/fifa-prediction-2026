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
          color: { value: "#00e1ff" },
          links: {
            color: "#00e1ff",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 40,
          },
          opacity: { value: 0.3 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 2 } },
        },
        detectRetina: true,
      }}
    />
  );
}
