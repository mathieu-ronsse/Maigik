export const serviceCosts = {
  upscale: 1,
  colorize: 1,
  extract: 2,
  generate: 10,
  outpaint: 10,
  animate: 50
} as const;

export type ServiceId = keyof typeof serviceCosts;