export type EggType = {
  name: string;
  levelBoundaries: number[];
  graphicLinks: string[];
  allowedAccessories: Set<string>;
  allowedInteractions: Set<string>;
};