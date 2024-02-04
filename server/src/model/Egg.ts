export class Egg {
  private eggType: string;
  private eggStage: number;
  private exp: number;
  private equippedAccessories: Set<string>;
 
  constructor(eggType: string) {
    this.eggType = eggType;
    this.eggStage = -1;
    this.exp = 0;
    this.equippedAccessories = new Set<string>();
  }

  getEggType(): string {
    return this.eggType;
  }

  setEggType(eggType: string): void {
    this.eggType = eggType;
  }

  getEggStage(): number {
    return this.eggStage;
  }

  setEggStage(eggStage: number): void {
    this.eggStage = eggStage;
  }

  getExp(): number {
    return this.exp;
  }

  setExp(exp: number): void {
    this.exp = exp;
  }

  getEquippedAccessories(): Set<string> {
    return this.equippedAccessories;
  }

  // TODO: implement this
  getJSON(): string {
    return "";
  }
}