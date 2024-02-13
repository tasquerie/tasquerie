import { Accessory } from "../types/Accessory";
import { EggType } from "../types/EggType";
import { Interaction } from "../types/Interaction";

export class EggManager {
  // ALL FIELDS FOR TESTING ONLY!!
  private USE_DB: boolean = false;
  private eggs: Map<string, EggType>;
  private interactions: Map<string, Interaction>;
  private accessories: Map<string, Accessory>;

  // TODO: Integrate with database to populate these maps
  constructor() {
    this.eggs = new Map<string, EggType>();
    this.interactions = new Map<string, Interaction>();
    this.accessories = new Map<string, Accessory>();

    if (!this.USE_DB) {
      this.eggs.set("egg1", this.makeEggType("egg1"))
      this.eggs.set("egg2", this.makeEggType("egg2"))

      this.interactions.set("inter1", this.makeInteraction("inter1"))
      this.interactions.set("inter2", this.makeInteraction("inter2"))

      this.accessories.set("acc1", this.makeAccessory("acc1"))
      this.accessories.set("acc2", this.makeAccessory("acc2"))
    }
  }

  // PRIVATE HELPERS FOR TESTING
  private makeEggType(name: string): EggType {
    const eggType: EggType = {
      name: name,
      levelBoundaries: [],
      graphicLinks: [],
      allowedAccessories: new Set<string>,
      allowedInteractions: new Set<string>,
    }
    return eggType;
  }

  private makeInteraction(name: string): Interaction {
    const inter: Interaction = {
      name: name,
      cost: 100,
      expGained: 100,
    }
    return inter;
  }

  private makeAccessory(name: string): Accessory {
    const acc: Accessory = {
      name: name,
      graphicLink: "",
      cost: 100,
    }
    return acc;
  }

  // TODO: Integrate with database
  public getEgg(name: string): EggType | undefined {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      return this.eggs.get(name);
    }
  }

  // TODO: Integrate with database
  public getInteraction(name: string): Interaction | undefined {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      return this.interactions.get(name);
    }
  }

  // TODO: Integrate with database
  public getAccessories(name: string): Accessory | undefined {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      return this.accessories.get(name);
    }
  }
}
