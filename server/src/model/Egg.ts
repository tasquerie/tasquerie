export class Egg {
  private eggType: string;
  private eggStage: number;
  private exp: number;
  private equippedAccessories: Set<string>;
  private ownedAccessories: Set<string>;

  constructor(eggType: string) {
    this.eggType = eggType;
    this.eggStage = 0;
    this.exp = 0;
    this.equippedAccessories = new Set<string>();
    this.ownedAccessories = new Set<string>();
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

  getOwnedAccessories(): Set<string> {
    return this.ownedAccessories;
  }

  // TODO: implement this
  // CHECK: frontend will parse the JSON String or if it should be given after travesered.
  getJSON(): string {
    const jsonEgg = {
      eggType: this.eggType,
      eggStage:this.eggStage,
      exp:this.exp,
      equippedAccessories:Array.from(this.equippedAccessories),
      ownedAccessories:Array.from(this.ownedAccessories)
    };
    return JSON.stringify(jsonEgg);
  }

  toFirestoreObject(): object {
    return {
      eggType: this.eggType,
      eggStage: this.eggStage,
      exp: this.exp,
      equippedAccessories: [...this.equippedAccessories],
      ownedAccessories: [...this.ownedAccessories],
    };
  }
}