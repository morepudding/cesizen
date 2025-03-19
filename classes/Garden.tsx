import { GardenElement } from './GardenElement';

export class Garden implements GardenElement {
  id: string;
  x: number = 0;
  y: number = 0;
  children: GardenElement[] = [];

  constructor(id: string) {
    this.id = id;
  }
  
  add(element: GardenElement) {
    this.children.push(element);
  }
  
  remove(element: GardenElement) {
    this.children = this.children.filter(child => child.id !== element.id);
  }
  
  render(): JSX.Element {
    return (
      <>
        {this.children.map(child => child.render())}
      </>
    );
  }
  
  setPosition(x: number, y: number): void {
    // Optionnel, selon tes besoins
  }
}
