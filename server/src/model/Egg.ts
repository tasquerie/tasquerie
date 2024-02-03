export class Egg {
  eggType: string;
  graphicLink: string;
  allowedAccessories: Set<string>;
  equippedAccessories: Set<string>;
 
  constructor(eggType: string) {
    this.eggType = eggType;
    this.allowedAccessories = new Set<string>();
    this.equippedAccessories = new Set<string>();
    switch (eggType) {
      case "Type A": {
        this.graphicLink = "Graphic A"
        this.allowedAccessories.add("Acc A");
      }
      case "Type B": {
        this.graphicLink = "Graphic B"
        this.allowedAccessories.add("Acc B");
      }
      default: {
        this.graphicLink = "Graphic Default"
        this.allowedAccessories.add("Acc Default");
      }
    }
  }
}