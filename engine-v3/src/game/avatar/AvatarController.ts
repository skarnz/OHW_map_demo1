import { Container, Graphics, Ticker } from 'pixi.js';
import { PathNode } from '../contracts';

export type AvatarState = 'idle' | 'walking' | 'celebrating';

const WALK_SPEED = 2.5;
const CELEBRATE_DURATION = 60;

// Colors
const SKIN = 0xFFD4A3;
const SKIN_DARK = 0xE6BE8A;
const SHIRT = 0x0A84FF;
const SHIRT_DARK = 0x0060CC;
const PANTS = 0x4A4A4A;
const SHOE = 0x333333;
const HAIR = 0x5C3A1E;
const EYE = 0x333333;
const CHEEK = 0xFFB5A3;

export class AvatarController {
  public container: Container;
  public state: AvatarState = 'idle';

  private bodyGroup: Container;

  private walkPath: { x: number; y: number }[] = [];
  private walkIndex = 0;
  private walkProgress = 0;
  private walkFrame = 0;

  private celebrateFrame = 0;
  private celebrateBaseY = 0;

  private onArrived?: (nodeId: string) => void;
  private onCelebrationDone?: () => void;
  private targetNodeId = '';

  constructor() {
    this.container = new Container();
    this.container.label = 'avatar';
    this.container.zIndex = 1000;

    this.bodyGroup = new Container();
    this.bodyGroup.label = 'body-group';
    this.container.addChild(this.bodyGroup);

    this.drawFrame('idle', 0);
  }

  setPosition(x: number, y: number) {
    this.container.x = x;
    this.container.y = y;
  }

  walkTo(
    targetNode: PathNode,
    pathNodes: PathNode[],
    currentNodeId: string,
    onArrived: (nodeId: string) => void,
  ) {
    if (this.state === 'walking') return;

    const startIdx = pathNodes.findIndex(n => n.id === currentNodeId);
    const endIdx = pathNodes.findIndex(n => n.id === targetNode.id);
    if (startIdx === -1 || endIdx === -1 || startIdx === endIdx) {
      onArrived(targetNode.id);
      return;
    }

    const step = startIdx < endIdx ? 1 : -1;
    this.walkPath = [];
    for (let i = startIdx; i !== endIdx + step; i += step) {
      const n = pathNodes[i];
      this.walkPath.push({ x: n.x, y: n.y - 38 });
    }

    this.walkIndex = 0;
    this.walkProgress = 0;
    this.walkFrame = 0;
    this.targetNodeId = targetNode.id;
    this.onArrived = onArrived;
    this.state = 'walking';
  }

  celebrate(onDone?: () => void) {
    this.state = 'celebrating';
    this.celebrateFrame = 0;
    this.celebrateBaseY = this.container.y;
    this.onCelebrationDone = onDone;
  }

  update(_delta: number) {
    if (this.state === 'walking') {
      this.updateWalk();
    } else if (this.state === 'celebrating') {
      this.updateCelebrate();
    } else {
      this.updateIdle();
    }
  }

  private updateWalk() {
    if (this.walkPath.length < 2 || this.walkIndex >= this.walkPath.length - 1) {
      this.state = 'idle';
      this.drawFrame('idle', 0);
      this.onArrived?.(this.targetNodeId);
      return;
    }

    const from = this.walkPath[this.walkIndex];
    const to = this.walkPath[this.walkIndex + 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const stepSize = WALK_SPEED / Math.max(dist, 1);

    this.walkProgress += stepSize;
    this.walkFrame++;

    if (this.walkProgress >= 1) {
      this.walkProgress = 0;
      this.walkIndex++;
      if (this.walkIndex >= this.walkPath.length - 1) {
        this.container.x = to.x;
        this.container.y = to.y;
        this.state = 'idle';
        this.drawFrame('idle', 0);
        this.onArrived?.(this.targetNodeId);
        return;
      }
    }

    const cx = from.x + (to.x - from.x) * this.walkProgress;
    const cy = from.y + (to.y - from.y) * this.walkProgress;
    this.container.x = cx;
    this.container.y = cy;

    this.container.scale.x = dx >= 0 ? 1 : -1;
    this.drawFrame('walking', this.walkFrame);
  }

  private updateCelebrate() {
    this.celebrateFrame++;
    const bounce = Math.sin(this.celebrateFrame * 0.3) * 8;
    this.container.y = this.celebrateBaseY + bounce;

    this.drawFrame('celebrating', this.celebrateFrame);

    if (this.celebrateFrame >= CELEBRATE_DURATION) {
      this.container.y = this.celebrateBaseY;
      this.container.scale.set(1);
      this.state = 'idle';
      this.drawFrame('idle', 0);
      this.onCelebrationDone?.();
    }
  }

  private updateIdle() {
    const t = Ticker.shared.lastTime * 0.002;
    const breathe = Math.sin(t) * 0.5;
    this.bodyGroup.y = breathe;
  }

  private drawFrame(anim: AvatarState, frame: number) {
    // Clear and redraw. Pixi Graphics are lightweight enough for this.
    this.bodyGroup.removeChildren();

    const g = new Graphics();
    this.bodyGroup.addChild(g);

    if (anim === 'idle') {
      this.drawIdlePose(g);
    } else if (anim === 'walking') {
      this.drawWalkPose(g, frame);
    } else {
      this.drawCelebratePose(g, frame);
    }
  }

  private drawIdlePose(g: Graphics) {
    // Shadow
    g.ellipse(0, 20, 12, 4);
    g.fill({ color: 0x000000, alpha: 0.15 });

    // Legs
    g.roundRect(-7, 8, 5, 12, 2);
    g.fill({ color: PANTS });
    g.roundRect(2, 8, 5, 12, 2);
    g.fill({ color: PANTS });

    // Shoes
    g.roundRect(-8, 18, 7, 4, 1);
    g.fill({ color: SHOE });
    g.roundRect(1, 18, 7, 4, 1);
    g.fill({ color: SHOE });

    // Body
    g.roundRect(-10, -8, 20, 18, 6);
    g.fill({ color: SHIRT });
    // Shirt stripe
    g.roundRect(-3, -4, 6, 10, 2);
    g.fill({ color: SHIRT_DARK });

    // Arms (at sides)
    g.roundRect(-14, -4, 5, 12, 2);
    g.fill({ color: SKIN });
    g.roundRect(9, -4, 5, 12, 2);
    g.fill({ color: SKIN });

    // Head
    g.circle(0, -16, 11);
    g.fill({ color: SKIN });

    // Hair
    g.arc(0, -18, 11, Math.PI, 0);
    g.fill({ color: HAIR });
    // Hair fringe
    g.roundRect(-9, -24, 6, 5, 2);
    g.fill({ color: HAIR });

    // Face
    g.circle(-4, -17, 1.8);
    g.fill({ color: EYE });
    g.circle(4, -17, 1.8);
    g.fill({ color: EYE });
    // Eye highlights
    g.circle(-3.5, -17.5, 0.6);
    g.fill({ color: 0xFFFFFF });
    g.circle(4.5, -17.5, 0.6);
    g.fill({ color: 0xFFFFFF });
    // Mouth
    g.arc(0, -12, 3, 0.1, Math.PI - 0.1);
    g.stroke({ width: 1.2, color: 0xCC8866 });
    // Cheeks
    g.circle(-7, -13, 2.5);
    g.fill({ color: CHEEK, alpha: 0.35 });
    g.circle(7, -13, 2.5);
    g.fill({ color: CHEEK, alpha: 0.35 });
  }

  private drawWalkPose(g: Graphics, frame: number) {
    const swing = Math.sin(frame * 0.4) * 6;

    // Shadow (moves with stride)
    g.ellipse(swing * 0.2, 20, 12, 4);
    g.fill({ color: 0x000000, alpha: 0.15 });

    // Legs (alternating stride)
    g.roundRect(-7 + swing, 8, 5, 12, 2);
    g.fill({ color: PANTS });
    g.roundRect(2 - swing, 8, 5, 12, 2);
    g.fill({ color: PANTS });

    // Shoes
    g.roundRect(-8 + swing, 18, 7, 4, 1);
    g.fill({ color: SHOE });
    g.roundRect(1 - swing, 18, 7, 4, 1);
    g.fill({ color: SHOE });

    // Body (slight lean forward)
    const lean = 1;
    g.roundRect(-10 + lean, -8, 20, 18, 6);
    g.fill({ color: SHIRT });
    g.roundRect(-3 + lean, -4, 6, 10, 2);
    g.fill({ color: SHIRT_DARK });

    // Arms (swinging opposite to legs)
    const armSwing = Math.sin(frame * 0.4) * 8;
    g.roundRect(-14 + lean, -4 - armSwing, 5, 12, 2);
    g.fill({ color: SKIN });
    g.roundRect(9 + lean, -4 + armSwing, 5, 12, 2);
    g.fill({ color: SKIN });

    // Head (slight bob)
    const bob = Math.abs(Math.sin(frame * 0.4)) * 1.5;
    g.circle(lean, -16 - bob, 11);
    g.fill({ color: SKIN });

    // Hair
    g.arc(lean, -18 - bob, 11, Math.PI, 0);
    g.fill({ color: HAIR });
    g.roundRect(-9 + lean, -24 - bob, 6, 5, 2);
    g.fill({ color: HAIR });

    // Face
    g.circle(-4 + lean, -17 - bob, 1.8);
    g.fill({ color: EYE });
    g.circle(4 + lean, -17 - bob, 1.8);
    g.fill({ color: EYE });
    g.circle(-3.5 + lean, -17.5 - bob, 0.6);
    g.fill({ color: 0xFFFFFF });
    g.circle(4.5 + lean, -17.5 - bob, 0.6);
    g.fill({ color: 0xFFFFFF });
    g.arc(lean, -12 - bob, 3, 0.1, Math.PI - 0.1);
    g.stroke({ width: 1.2, color: 0xCC8866 });
    g.circle(-7 + lean, -13 - bob, 2.5);
    g.fill({ color: CHEEK, alpha: 0.35 });
    g.circle(7 + lean, -13 - bob, 2.5);
    g.fill({ color: CHEEK, alpha: 0.35 });
  }

  private drawCelebratePose(g: Graphics, frame: number) {
    // Shadow
    g.ellipse(0, 20, 14, 5);
    g.fill({ color: 0x000000, alpha: 0.12 });

    // Legs (spread slightly)
    g.roundRect(-9, 8, 5, 12, 2);
    g.fill({ color: PANTS });
    g.roundRect(4, 8, 5, 12, 2);
    g.fill({ color: PANTS });

    // Shoes
    g.roundRect(-10, 18, 7, 4, 1);
    g.fill({ color: SHOE });
    g.roundRect(3, 18, 7, 4, 1);
    g.fill({ color: SHOE });

    // Body (slightly puffed up)
    g.roundRect(-11, -9, 22, 19, 6);
    g.fill({ color: SHIRT });
    g.roundRect(-3, -5, 6, 10, 2);
    g.fill({ color: SHIRT_DARK });

    // Arms (raised up in celebration, waving)
    const wave = Math.sin(frame * 0.5) * 10;
    g.roundRect(-16, -18 + wave, 5, 14, 2);
    g.fill({ color: SKIN });
    g.roundRect(11, -18 - wave, 5, 14, 2);
    g.fill({ color: SKIN });

    // Head
    g.circle(0, -16, 11);
    g.fill({ color: SKIN });

    // Hair
    g.arc(0, -18, 11, Math.PI, 0);
    g.fill({ color: HAIR });
    g.roundRect(-9, -24, 6, 5, 2);
    g.fill({ color: HAIR });

    // Happy face (big smile, squinted eyes)
    // Squinted happy eyes
    g.arc(-4, -17, 2, Math.PI + 0.3, -0.3);
    g.stroke({ width: 1.8, color: EYE });
    g.arc(4, -17, 2, Math.PI + 0.3, -0.3);
    g.stroke({ width: 1.8, color: EYE });
    // Big smile
    g.arc(0, -12, 4, 0.2, Math.PI - 0.2);
    g.stroke({ width: 1.5, color: 0xCC8866 });
    // Rosy cheeks (more visible)
    g.circle(-7, -13, 3);
    g.fill({ color: CHEEK, alpha: 0.5 });
    g.circle(7, -13, 3);
    g.fill({ color: CHEEK, alpha: 0.5 });

    // Star sparkles around character
    const sparklePhase = frame * 0.15;
    for (let i = 0; i < 3; i++) {
      const angle = sparklePhase + (i * Math.PI * 2) / 3;
      const dist = 20 + Math.sin(frame * 0.3 + i) * 5;
      const sx = Math.cos(angle) * dist;
      const sy = -10 + Math.sin(angle) * dist * 0.6;
      const size = 2 + Math.sin(frame * 0.4 + i * 2) * 1;
      const alpha = 0.6 + Math.sin(frame * 0.3 + i) * 0.3;
      g.star(sx, sy, 4, size, size * 0.4);
      g.fill({ color: 0xFFD700, alpha });
    }
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
