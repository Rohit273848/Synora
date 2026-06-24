import React, { useState } from 'react';
import { Sparkles, Brain, CheckSquare, Bookmark, ArrowRight } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to Synora",
      description: "Where Memory Meets Intelligence. A premium, unified SaaS-style workspace that captures everything you learn, plan, read, write, and accomplish.",
      icon: <Brain size={48} style={{ color: 'var(--color-primary)' }} />,
      colorClass: "text-gradient"
    },
    {
      title: "Consolidate Your Resources",
      description: "Save YouTube videos, websites, research papers, and Obsidian-style notes. Build a digital archive of your experience.",
      icon: <Bookmark size={48} style={{ color: 'var(--color-cyan)' }} />,
      colorClass: "text-gradient-cyan"
    },
    {
      title: "Context-Aware AI Assistant",
      description: "Query your digital archive in natural language. The AI engine searches, aggregates, and cites your specific personal records.",
      icon: <Sparkles size={48} style={{ color: 'var(--color-purple)' }} />,
      colorClass: "text-gradient"
    },
    {
      title: "Streamline Action Items",
      description: "Manage milestones, habit trackers, and linear-style task boards. Watch your knowledge map automatically expand.",
      icon: <CheckSquare size={48} style={{ color: 'var(--color-emerald)' }} />,
      colorClass: "text-gradient-cyan"
    }
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }} className="animate-fade-in">
      <div className="bg-glow"></div>
      <div className="bg-glow-left"></div>

      <div className="card-glass" style={{
        width: '100%',
        maxWidth: '540px',
        padding: '50px 40px',
        zIndex: 5,
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        minHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-icon" style={{ width: '24px', height: '24px', fontSize: '0.8rem', borderRadius: '4px' }}>Ω</div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>SYNORA</span>
          </div>
          <span
            onClick={onComplete}
            style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', cursor: 'pointer', fontWeight: 500 }}
            className="hover-bright"
          >
            Skip Intro
          </span>
        </div>

        {/* Slide Content */}
        <div style={{ margin: '40px 0', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            padding: '24px',
            borderRadius: '24px',
            marginBottom: '10px',
            display: 'inline-flex'
          }}>
            {slides[activeSlide].icon}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
            {activeSlide === 0 ? (
              <>Welcome to <span className={slides[activeSlide].colorClass}>Synora</span></>
            ) : (
              <span className={slides[activeSlide].colorClass}>{slides[activeSlide].title}</span>
            )}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto' }}>
            {slides[activeSlide].description}
          </p>
        </div>

        {/* Bottom Control */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Indicators */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => setActiveSlide(index)}
                style={{
                  width: activeSlide === index ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: activeSlide === index ? 'var(--color-primary)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              ></div>
            ))}
          </div>

          <button onClick={handleNext} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            {activeSlide === slides.length - 1 ? 'Enter Terminal' : 'Next'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
