import { GardenElement } from './GardenElement';
import { Garden } from './Garden';

// Interface pour encapsuler les actions
export interface Command {
  execute(): void;
  undo(): void;
}

// Commande pour déplacer un élément
export class MoveCommand implements Command {
  element: GardenElement;
  previousX: number;
  previousY: number;
  newX: number;
  newY: number;

  constructor(element: GardenElement, newX: number, newY: number) {
    this.element = element;
    this.previousX = element.x;
    this.previousY = element.y;
    this.newX = newX;
    this.newY = newY;
  }

  execute(): void {
    this.element.setPosition(this.newX, this.newY);
  }
  
  undo(): void {
    this.element.setPosition(this.previousX, this.previousY);
  }
}

// Commande pour ajouter un élément
export class AddElementCommand implements Command {
  private garden: Garden;
  private element: GardenElement;

  constructor(garden: Garden, element: GardenElement) {
    this.garden = garden;
    this.element = element;
  }

  execute(): void {
    this.garden.add(this.element);
  }

  undo(): void {
    this.garden.remove(this.element);
  }
}

// Commande pour supprimer un élément
export class RemoveElementCommand implements Command {
  private garden: Garden;
  private element: GardenElement;

  constructor(garden: Garden, element: GardenElement) {
    this.garden = garden;
    this.element = element;
  }

  execute(): void {
    this.garden.remove(this.element);
  }

  undo(): void {
    this.garden.add(this.element);
  }
}
