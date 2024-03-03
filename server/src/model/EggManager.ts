import { Accessory } from "../types/Accessory";
import { EggType } from "../types/EggType";
import { Interaction } from "../types/Interaction";
import { FirebaseEggAPI } from "../firebaseAPI";
import { Result } from "../types/FirebaseResult";
export class EggManager {
  // ALL FIELDS FOR TESTING ONLY!!
  public USE_DB: boolean = false;
  private eggTypes: Map<string, EggType>;
  private interactions: Map<string, Interaction>;
  private accessories: Map<string, Accessory>;

  // TODO: Integrate with database to populate these maps
  constructor() {
    this.eggTypes = new Map<string, EggType>();
    this.interactions = new Map<string, Interaction>();
    this.accessories = new Map<string, Accessory>();

    if (!this.USE_DB) {
      this.eggTypes.set("egg1", this.makeEggType("egg1"))
      this.eggTypes.set("egg2", this.makeEggType("egg2"))

      this.interactions.set("inter1", this.makeInteraction("inter1"))
      this.interactions.set("inter2", this.makeInteraction("inter2"))

      this.accessories.set("acc1", this.makeAccessory("acc1"))
      this.accessories.set("acc2", this.makeAccessory("acc2"))
    }
  }

  // PRIVATE HELPERS FOR TESTING
  private makeEggType(name: string): EggType {
    let allowedAcc = new Set<string>();
    allowedAcc.add("acc1");
    allowedAcc.add("acc2");
    let allowedInt = new Set<string>();
    allowedInt.add("inter1");
    allowedInt.add("inter2");
    let bounds = [100, 200, 300, 400, 500];
    const eggType: EggType = {
      name: name,
      levelBoundaries: bounds,
      graphicLinks: [],
      allowedAccessories: allowedAcc,
      allowedInteractions: allowedInt,
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

  public async getEggType(name: string): Promise<EggType | undefined> {
    if (this.USE_DB) {
      const output = await FirebaseEggAPI.getType("eggType", name);
      const egg = output.content as EggType;
      return egg;
    } else {
      return this.eggTypes.get(name);
    }
  }

  public async getInteraction(name: string): Promise<Interaction | undefined> {
    if (this.USE_DB) {
      const output = await FirebaseEggAPI.getType("interaction", name);
      const interaction = output.content as Interaction;
      return interaction;
    } else {
      return this.interactions.get(name);
    }
  }

  public async getAccessory(name: string): Promise<Accessory | undefined> {
    if (this.USE_DB) {
      const output = await FirebaseEggAPI.getType("accessory", name);
      const accessory = output.content as Accessory;
      return accessory;
    } else {
      return this.accessories.get(name);
    }
  }

  public getEggTypeJSON(name: string): string {
    let eggType = this.getEggType(name);
    if (eggType === undefined) {
      return "";
    }
    return JSON.stringify(eggType);
  }

  public getInteractionJSON(name: string): string {
    let interaction = this.getInteraction(name);
    if (interaction === undefined) {
      return "";
    }
    return JSON.stringify(interaction);
  }

  public getAccessoryJSON(name: string): string {
    let accessory = this.getAccessory(name);
    if (accessory === undefined) {
      return "";
    }
    return JSON.stringify(accessory);
  }
}
