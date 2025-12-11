import { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticles = () => {
      if (!particlesRef.current) return;

      // Clear existing particles
      particlesRef.current.innerHTML = '';

      // Create 15 particles
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 4}s`;
        particlesRef.current.appendChild(particle);
      }
    };

    createParticles();

    // Recreate particles periodically to maintain the effect
    const interval = setInterval(createParticles, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={particlesRef} className="particles" />
  );
};

export default ParticlesBackground;
