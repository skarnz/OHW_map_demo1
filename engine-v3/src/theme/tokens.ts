// Design tokens extracted from Figma (OHW Patient UI)

export const COLORS = {
  bgPrimary: '#F7F7F7',
  bgWhite: '#FFFFFF',
  bgCard: '#FFFFFF',

  textPrimary: '#0A0A0A',
  textSecondary: '#8C8C8C',
  textMuted: '#BFBFBF',

  accentBlue: '#0A84FF',
  accentRed: '#D21737',
  accentYellow: '#D2BD17',
  accentGold: '#FFB200',
  accentTeal: '#00B3A7',

  progressTrack: '#F4F4F4',
  borderLight: 'rgba(10, 10, 10, 0.07)',

  // Game-specific
  nodeLocked: '#D1D1D1',
  nodeUnlocked: '#FFFFFF',
  nodeInProgress: '#FFB200',
  nodeCompleted: '#34C759',
  nodeSkipped: '#A0A0A0',

  pathDefault: '#C4A882',
  pathCompleted: '#8B7355',
} as const;

export const TYPOGRAPHY = {
  h1: { size: 26, weight: '700' as const },
  h2: { size: 18, weight: '600' as const },
  body: { size: 16, weight: '400' as const },
  caption: { size: 14, weight: '400' as const },
  tabLabel: { size: 13, weight: '500' as const },
} as const;

export const SPACING = {
  screenPadding: 20,
  cardPadding: 18,
  sectionGap: 16,
  cardRadius: 16,
  buttonRadius: 12,
} as const;

// Biome color palettes
export const BIOME_PALETTES = {
  wilderness: {
    ground: 0x4A7C3F,
    path: 0xC4A882,
    water: 0x4A90D9,
    accent: 0x2D5A1E,
  },
  town: {
    ground: 0x6B9E5A,
    path: 0xD4B896,
    water: 0x5BA3E6,
    accent: 0x8B4513,
  },
  suburbs: {
    ground: 0x7FB069,
    path: 0xE0C8A8,
    water: 0x6DB3F2,
    accent: 0x708090,
  },
  city: {
    ground: 0x808080,
    path: 0xD0D0D0,
    water: 0x7BC3FF,
    accent: 0x2C2C2C,
  },
} as const;

export type BiomePalette = typeof BIOME_PALETTES[keyof typeof BIOME_PALETTES];

// Seasonal tint multipliers applied on top of biome palettes.
export const SEASON_TINTS = {
  spring: { r: 0.0, g: 0.05, b: -0.05 },
  summer: { r: 0.05, g: 0.0, b: -0.08 },
  fall:   { r: 0.1, g: -0.05, b: -0.12 },
  winter: { r: -0.05, g: -0.03, b: 0.08 },
} as const;

function tintColor(hex: number, tint: { r: number; g: number; b: number }): number {
  let r = (hex >> 16) & 0xFF;
  let g = (hex >> 8) & 0xFF;
  let b = hex & 0xFF;
  r = Math.max(0, Math.min(255, Math.round(r * (1 + tint.r))));
  g = Math.max(0, Math.min(255, Math.round(g * (1 + tint.g))));
  b = Math.max(0, Math.min(255, Math.round(b * (1 + tint.b))));
  return (r << 16) | (g << 8) | b;
}

export function getSeasonalPalette(
  biome: keyof typeof BIOME_PALETTES,
  season: keyof typeof SEASON_TINTS,
): { ground: number; path: number; water: number; accent: number } {
  const base = BIOME_PALETTES[biome];
  const tint = SEASON_TINTS[season];
  return {
    ground: tintColor(base.ground, tint),
    path: tintColor(base.path, tint),
    water: tintColor(base.water, tint),
    accent: tintColor(base.accent, tint),
  };
}
