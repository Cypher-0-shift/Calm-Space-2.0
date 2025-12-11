// src/components/ParticlesBackground.jsx
import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: {
            value: "#fceabb", // fallback color
          },
        },
        particles: {
          number: {
            value: 30,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: ["#ff69b4", "#ffd1ff", "#ffc0cb", "#ffffff"],
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.6,
            random: true,
          },
          size: {
            value: 6,
            random: true,
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            random: true,
            outMode: "out",
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            repulse: {
              distance: 80,
              duration: 0.5,
            },
            push: {
              quantity: 3,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
