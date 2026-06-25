declare module 'canvas-confetti' {
  export default function confetti(options?: {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    [key: string]: unknown;
  }): void;
}
