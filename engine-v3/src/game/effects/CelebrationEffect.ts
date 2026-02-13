import { Container, Graphics, Text as PixiText, TextStyle } from 'pixi.js';

const PARTICLE_COUNT = 12;
const EFFECT_DURATION = 70; // frames

interface Particle {
  graphic: Graphics;
  vx: number;
  vy: number;
  gravity: number;
  fadeRate: number;
}

export class CelebrationEffect {
  public container: Container;
  private particles: Particle[] = [];
  private pointsText: PixiText | null = null;
  private frame = 0;
  private active = false;
  private onComplete?: () => void;

  constructor() {
    this.container = new Container();
    this.container.label = 'celebration';
    this.container.zIndex = 2000;
  }

  play(x: number, y: number, points: number, onComplete?: () => void) {
    this.cleanup();
    this.container.x = x;
    this.container.y = y;
    this.frame = 0;
    this.active = true;
    this.onComplete = onComplete;

    // Spawn particles
    const colors = [0xFFB200, 0xFF6B35, 0x34C759, 0x0A84FF, 0xFFD700, 0xFF69B4];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 3;
      const size = 3 + Math.random() * 4;

      const g = new Graphics();
      if (Math.random() > 0.5) {
        g.circle(0, 0, size);
      } else {
        g.star(0, 0, 4, size, size * 0.4);
      }
      g.fill({ color: colors[i % colors.length] });

      this.container.addChild(g);
      this.particles.push({
        graphic: g,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        gravity: 0.08,
        fadeRate: 0.015 + Math.random() * 0.01,
      });
    }

    // Points popup
    if (points > 0) {
      const style = new TextStyle({
        fontSize: 22,
        fontWeight: 'bold',
        fill: '#FFB200',
        stroke: { color: '#FFFFFF', width: 3 },
        align: 'center',
      });
      this.pointsText = new PixiText({ text: `+${points}`, style });
      this.pointsText.anchor.set(0.5);
      this.pointsText.y = -30;
      this.container.addChild(this.pointsText);
    }
  }

  update() {
    if (!this.active) return;
    this.frame++;

    // Animate particles
    for (const p of this.particles) {
      p.graphic.x += p.vx;
      p.graphic.y += p.vy;
      p.vy += p.gravity;
      p.graphic.alpha = Math.max(0, p.graphic.alpha - p.fadeRate);
      p.graphic.scale.set(Math.max(0, 1 - this.frame / EFFECT_DURATION));
    }

    // Animate points text
    if (this.pointsText) {
      this.pointsText.y -= 1.2;
      if (this.frame > EFFECT_DURATION * 0.5) {
        this.pointsText.alpha = Math.max(0, this.pointsText.alpha - 0.04);
      }
    }

    if (this.frame >= EFFECT_DURATION) {
      this.active = false;
      this.cleanup();
      this.onComplete?.();
    }
  }

  private cleanup() {
    for (const p of this.particles) {
      p.graphic.destroy();
    }
    this.particles = [];
    if (this.pointsText) {
      this.pointsText.destroy();
      this.pointsText = null;
    }
  }

  destroy() {
    this.cleanup();
    this.container.destroy({ children: true });
  }
}
