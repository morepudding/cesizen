// /classes/GardenElementFactory.ts
import { GardenElement, Stone, Bonsai, Lantern, Pond } from './GardenElement';

export class GardenElementFactory {
  static createElement(type: string, id: string, x: number, y: number): GardenElement {
    switch(type) {
      case 'stone':
        return new Stone(id, x, y);
      case 'bonsai':
        return new Bonsai(id, x, y);
      case 'lantern':
        return new Lantern(id, x, y);
      case 'pond':
        return new Pond(id, x, y);
      default:
        throw new Error(`Type d'élément inconnu: ${type}`);
    }
  }
}
