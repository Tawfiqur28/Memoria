import { useEffect, useRef, useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #05050f; --surface2: #1a1a2e; --border: #1e1e35; --border2: #2a2a45;
  --purple: #a78bfa; --purple2: #7c3aed; --teal: #2dd4bf; --text: #f1f5f9; --text2: #94a3b8; --text3: #475569;
}
html, body { background: var(--bg); font-family: 'Inter', sans-serif; color: var(--text); overflow-x: hidden; }
.landing-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; padding: 3rem 1.5rem; text-align: center; overflow: hidden; transition: opacity 0.5s ease, transform 0.5s ease; }
canvas.particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.landing-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
.logo-ring { width: 100px; height: 100px; border-radius: 50%; position: relative; margin-bottom: 2rem; animation: float 4s ease-in-out infinite; }
.logo-ring-outer { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; background: linear-gradient(var(--bg), var(--bg)) padding-box, conic-gradient(from 0deg, #7c3aed, #2dd4bf, #f472b6, #7c3aed) border-box; animation: spin 6s linear infinite; }
.logo-ring-inner { position: absolute; inset: 8px; border-radius: 50%; background: linear-gradient(135deg, #1a1a3e, #0d0d1a); display: flex; align-items: center; justify-content: center; font-size: 36px; z-index: 1; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes fadeup { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse-ring { 0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); } 50% { box-shadow: 0 0 0 20px rgba(124,58,237,0); } }
.eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--purple); background: rgba(124,58,237,.12); border: 0.5px solid rgba(167,139,250,.25); padding: 5px 16px; border-radius: 20px; margin-bottom: 1.5rem; animation: fadeup 0.8s ease both; }
.hero-title { font-size: clamp(56px, 10vw, 96px); font-weight: 700; line-height: 1; letter-spacing: -.04em; margin-bottom: 1.2rem; animation: fadeup 0.8s 0.1s ease both; background: linear-gradient(135deg, #a78bfa 0%, #2dd4bf 50%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.tagline { font-size: clamp(15px, 2.2vw, 19px); color: var(--text2); line-height: 1.7; max-width: 580px; margin: 0 auto 2.5rem; font-weight: 300; animation: fadeup 0.8s 0.2s ease both; }
.tagline strong { color: var(--text); font-weight: 500; }
.cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; animation: fadeup 0.8s 0.35s ease both; margin-bottom: 3rem; }
.btn-start { padding: 15px 36px; border-radius: 14px; background: linear-gradient(135deg, var(--purple2), #5b21b6); border: none; color: #fff; font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.3s; animation: pulse-ring 3s infinite; }
.btn-start:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(124,58,237,.6); }
.btn-learn { padding: 15px 30px; border-radius: 14px; background: transparent; border: 1px solid var(--border2); color: var(--text2); font-size: 15px; font-weight: 500; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.3s; }
.btn-learn:hover { border-color: var(--purple); color: var(--purple); background: rgba(124,58,237,.08); transform: translateY(-2px); }
.features-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; max-width: 680px; margin: 0 auto 2.5rem; animation: fadeup 0.8s 0.5s ease both; }
@media (max-width: 600px) { .features-row { grid-template-columns: 1fr; } }
.feat-card { background: rgba(255,255,255,.03); border: 0.5px solid var(--border); border-radius: 16px; padding: 18px 14px; text-align: left; transition: all 0.4s; position: relative; overflow: hidden; }
.feat-card:hover { border-color: var(--purple); transform: translateY(-5px); box-shadow: 0 10px 40px rgba(124,58,237,.2); }
.feat-icon { font-size: 24px; margin-bottom: 10px; }.feat-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 5px; }.feat-desc { font-size: 12px; color: var(--text3); line-height: 1.6; }
.scroll-hint { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--text3); font-size: 11px; animation: fadeup 0.8s 0.7s ease both; }
.scroll-line { width: 1px; height: 32px; background: linear-gradient(to bottom, transparent, var(--text3)); animation: scrollpulse 2s infinite; }
@keyframes scrollpulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1.5rem; backdrop-filter: blur(4px); animation: fadeup 0.3s ease; }
.modal-box { background: var(--surface2); border: 0.5px solid var(--border2); border-radius: 24px; padding: 2rem; max-width: 500px; width: 100%; animation: fadeup 0.3s ease; }
.modal-title { font-size: 22px; font-weight: 700; margin-bottom: 1.5rem; background: linear-gradient(135deg, var(--purple), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.learn-feature { display: flex; gap: 14px; margin-bottom: 1.2rem; align-items: flex-start; }
.lf-icon { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.lf-title { font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px; }.lf-desc { font-size: 12px; color: #94a3b8; line-height: 1.6; }
.btn-primary,.btn-secondary { width: 100%; border-radius: 14px; font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.3s; }
.btn-primary { padding: 13px; background: linear-gradient(135deg, var(--purple2), #5b21b6); border: none; color: #fff; font-weight: 600; margin-bottom: 8px; }
.btn-secondary { padding: 12px; background: transparent; border: 0.5px solid var(--border2); color: var(--text2); }
.stat-strip { display: flex; justify-content: center; gap: 2.5rem; padding: 1.5rem 0; border-top: 0.5px solid var(--border); margin-bottom: 2.5rem; animation: fadeup 0.8s 0.6s ease both; }
.stat-n { font-size: 22px; font-weight: 700; background: linear-gradient(135deg, var(--purple), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.stat-l { font-size: 11px; color: var(--text3); margin-top: 2px; }
`;

type Props = { onStart: () => void };

export default function LandingPage({ onStart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const pts: Array<{ x: number; y: number; vx: number; vy: number; r: number; a: number }> = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 70; i += 1) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.5 + 0.2,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.a * 0.5})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  function handleStart() {
    setLeaving(true);
  }

  // Clean up timeout when component unmounts or leaving state changes
  useEffect(() => {
    if (leaving) {
      const timer = setTimeout(() => {
        onStart();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [leaving, onStart]);

  return (
    <>
      <canvas ref={canvasRef} className="particles" />
      <div className="landing-wrap" style={{ opacity: leaving ? 0 : 1, transform: leaving ? "translateY(-20px)" : "translateY(0)" }}>
        <div className="landing-inner">
          <div className="eyebrow">AI-powered memory companion</div>
          <div className="logo-ring"><div className="logo-ring-outer" /><div className="logo-ring-inner">🧠</div></div>
          <h1 className="hero-title">Memoria</h1>
          <p className="tagline">The AI that <strong>remembers everything</strong> — so your loved one never feels lost.</p>
          <div className="cta-row">
            <button className="btn-start" onClick={handleStart}>Start your journey &nbsp;→</button>
            <button className="btn-learn" onClick={() => setShowModal(true)}>Learn more</button>
          </div>
          <div className="stat-strip">
            <div><div className="stat-n">55M+</div><div className="stat-l">People with dementia</div></div>
            <div><div className="stat-n">24/7</div><div className="stat-l">Always listening</div></div>
            <div><div className="stat-n">∞</div><div className="stat-l">Memories preserved</div></div>
          </div>
          <div className="features-row">
            <div className="feat-card"><div className="feat-icon">📞</div><div className="feat-title">Knows every caller</div><div className="feat-desc">Animated face + whisper before they answer.</div></div>
            <div className="feat-card"><div className="feat-icon">🧠</div><div className="feat-title">Living memory</div><div className="feat-desc">Stores stories, people and routines.</div></div>
            <div className="feat-card"><div className="feat-icon">♾️</div><div className="feat-title">Immortal legacy</div><div className="feat-desc">Family can still speak with them after loss.</div></div>
          </div>
          <div className="scroll-hint"><span>scroll to explore</span><div className="scroll-line" /></div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">How Memoria works</div>
            <div className="learn-feature"><div className="lf-icon" style={{ background: "rgba(124,58,237,.2)" }}>📞</div><div><div className="lf-title">Incoming call overlay</div><div className="lf-desc">Animated photo and identity whisper before answer.</div></div></div>
            <div className="learn-feature"><div className="lf-icon" style={{ background: "rgba(13,148,136,.2)" }}>🧠</div><div><div className="lf-title">Memory graph</div><div className="lf-desc">People, stories, routines in one personalized context.</div></div></div>
            <button className="btn-primary" onClick={() => { setShowModal(false); handleStart(); }}>Set up now →</button>
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}