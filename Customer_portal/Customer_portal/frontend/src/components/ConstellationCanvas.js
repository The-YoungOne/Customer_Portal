import React, { useRef, useEffect, useState } from 'react';

const ConstellationCanvas = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  // Set up the canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const numParticles = 100;
    const maxLineDistance = 150;
    const particleRadius = 2;
    let animationFrameId;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Adjust canvas size on window resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);

    // Particle constructor
    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.velocityX = (Math.random() - 0.5) * 2;
      this.velocityY = (Math.random() - 0.5) * 2;
      this.color = 'rgba(255, 255, 255, 0.8)';
    }

    // Particle update logic
    Particle.prototype.update = function () {
      // Move toward the mouse if it's nearby
      const dx = mousePosition.x - this.x;
      const dy = mousePosition.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If the mouse is close enough, adjust particle velocity
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        this.velocityX += Math.cos(angle) * 5;
        this.velocityY += Math.sin(angle) * 0.0105;
      }

      // Update position based on velocity
      this.x += this.velocityX;
      this.y += this.velocityY;

      // Bounce particles off walls
      if (this.x < 0 || this.x > canvas.width) this.velocityX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.velocityY *= -1;
    };

    // Particle draw logic
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, particleRadius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    };

    // Initialize particles
    function initParticles() {
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }

    // Draw lines between particles
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxLineDistance) {
            const opacity = 1 - distance / maxLineDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }

    // Animate particles and draw lines
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      drawLines();

      animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize everything and start animation
    initParticles();
    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);  // Add mousePosition to the dependency array

  // Mouse move event listener to update mouse position
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);  // Empty dependency array to set up the event listener once

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default ConstellationCanvas;
