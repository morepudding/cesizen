// /classes/GardenElement.ts
import React from 'react';

export interface GardenElement {
  id: string;
  x: number;
  y: number;
  render(): JSX.Element;
  setPosition(x: number, y: number): void;
}

export class Stone implements GardenElement {
  id: string;
  x: number;
  y: number;
  
  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
  
  render(): JSX.Element {
    return (
      <div 
        key={this.id}
        style={{
          position: 'absolute',
          left: this.x,
          top: this.y,
          cursor: 'move',
          width: '50px',
          height: '50px'
        }}
      >
        <img src="images/stone.svg" alt="Stone" style={{ width: '100%', height: '100%' }}/>
      </div>
    );
  }
  
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Bonsai implements GardenElement {
  id: string;
  x: number;
  y: number;
  
  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
  
  render(): JSX.Element {
    return (
      <div 
        key={this.id}
        style={{
          position: 'absolute',
          left: this.x,
          top: this.y,
          cursor: 'move',
          width: '50px',
          height: '50px'
        }}
      >
        <img src="/images/bonsai.svg" alt="Bonsai" style={{ width: '100%', height: '100%' }}/>
      </div>
    );
  }
  
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Lantern implements GardenElement {
  id: string;
  x: number;
  y: number;
  
  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
  
  render(): JSX.Element {
    return (
      <div 
        key={this.id}
        style={{
          position: 'absolute',
          left: this.x,
          top: this.y,
          cursor: 'move',
          width: '50px',
          height: '50px'
        }}
      >
        <img src="/images/lantern.svg" alt="Lantern" style={{ width: '100%', height: '100%' }}/>
      </div>
    );
  }
  
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Pond implements GardenElement {
  id: string;
  x: number;
  y: number;
  
  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
  
  render(): JSX.Element {
    return (
      <div 
        key={this.id}
        style={{
          position: 'absolute',
          left: this.x,
          top: this.y,
          cursor: 'move',
          width: '100px',
          height: '100px'
        }}
      >
        <img src="/images/pond.svg" alt="Pond" style={{ width: '100%', height: '100%' }}/>
      </div>
    );
  }
  
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}
