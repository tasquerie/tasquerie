import { Accessory } from "../types/Accessory";
import { EggType } from "../types/EggType";
import { Interaction } from "../types/Interaction";

export class EggManager {
  private eggs: Map<string, EggType>;
  private interactions: Map<string, Interaction>;
  private accessories: Map<string, Accessory>;

  // TODO: Integrate with database to populate these maps
  constructor() {
    this.eggs = new Map<string, EggType>();
    this.interactions = new Map<string, Interaction>();
    this.accessories = new Map<string, Accessory>();
  }

  public getEgg(name: string): EggType | undefined {
    return this.eggs.get(name);
  }

  public getInteraction(name: string): Interaction | undefined {
    return this.interactions.get(name);
  }

  public getAccessories(name: string): Accessory | undefined {
    return this.accessories.get(name);
  }
}
