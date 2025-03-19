'use client';

import React, { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Garden } from '../classes/Garden';
import { GardenElementFactory } from '../classes/GardenElementFactory';
import { CommandManager } from '../classes/CommandManager';
import { AddElementCommand, MoveCommand, RemoveElementCommand } from '../classes/Command';
import windAnimationData from '../assets/windAnimation.json';

const MOVE_OFFSET = 10;

const ZenGarden: React.FC = () => {
  const [garden] = useState(new Garden('garden1'));
  const [_, forceUpdate] = useState(0);
  const commandManagerRef = useRef(new CommandManager());
  const [selectedElement, setSelectedElement] = useState<null | typeof garden.children[0]>(null);
  
  // États pour l'animation de vent
  const [isWindActive, setIsWindActive] = useState(false);
  const [windPosition, setWindPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Options pour Lottie
  const windAnimationOptions = {
    animationData: windAnimationData,
    loop: false,
    autoplay: true,
  };

  // Planification de l'animation de vent à des intervalles aléatoires
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    const triggerWind = () => {
      // Détermine la largeur/hauteur du canevas si possible
      let canvasWidth = 800;
      let canvasHeight = 600;
      if (canvasRef.current) {
        canvasWidth = canvasRef.current.clientWidth;
        canvasHeight = canvasRef.current.clientHeight;
      }
      const overlayWidth = 200;
      const overlayHeight = 200;
      // Position aléatoire sur le canevas
      const randomX = Math.random() * (canvasWidth - overlayWidth);
      const randomY = Math.random() * (canvasHeight - overlayHeight);
      setWindPosition({ x: randomX, y: randomY });
      
      setIsWindActive(true);
      // L'animation se désactive après 1 seconde
      setTimeout(() => {
        setIsWindActive(false);
      }, 5000);
    };

    const scheduleNextWind = () => {
      // Délai aléatoire entre 3000ms et 10000ms (3 à 10 secondes)
      const randomDelay = Math.random() * (10000 - 3000) + 3000;
      timerId = setTimeout(() => {
        triggerWind();
        scheduleNextWind();
      }, randomDelay);
    };

    scheduleNextWind();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // Gestion du drop d'un élément depuis la toolbox
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("type");
    const id = `elem-${Date.now()}`;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const element = GardenElementFactory.createElement(type, id, x, y);
    const addCommand = new AddElementCommand(garden, element);
    commandManagerRef.current.executeCommand(addCommand);
    forceUpdate(n => n + 1);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUndo = () => {
    commandManagerRef.current.undo();
    if (selectedElement && !garden.children.find(el => el.id === selectedElement.id)) {
      setSelectedElement(null);
    }
    forceUpdate(n => n + 1);
  };

  const handleRedo = () => {
    commandManagerRef.current.redo();
    forceUpdate(n => n + 1);
  };

  // Déplacement de l'élément sélectionné
  const moveSelectedElement = (dx: number, dy: number) => {
    if (selectedElement) {
      const newX = selectedElement.x + dx;
      const newY = selectedElement.y + dy;
      const moveCommand = new MoveCommand(selectedElement, newX, newY);
      commandManagerRef.current.executeCommand(moveCommand);
      forceUpdate(n => n + 1);
    }
  };

  // Suppression de l'élément sélectionné
  const removeSelectedElement = () => {
    if (selectedElement) {
      const removeCommand = new RemoveElementCommand(garden, selectedElement);
      commandManagerRef.current.executeCommand(removeCommand);
      setSelectedElement(null);
      forceUpdate(n => n + 1);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Toolbox */}
      <div style={{ width: '150px', marginRight: '20px', borderRight: '1px solid #ccc' }}>
        {/* Stone */}
        <div 
          draggable 
          onDragStart={(e) => e.dataTransfer.setData("type", "stone")}
          style={{
            padding: '8px',
            cursor: 'grab',
            border: '1px solid #ddd',
            margin: '5px',
            textAlign: 'center'
          }}
        >
          <img src="/images/stone.svg" alt="Stone" style={{ width: '30px', height: '30px' }}/>
          <div>Stone</div>
        </div>
        {/* Bonsai */}
        <div 
          draggable 
          onDragStart={(e) => e.dataTransfer.setData("type", "bonsai")}
          style={{
            padding: '8px',
            cursor: 'grab',
            border: '1px solid #ddd',
            margin: '5px',
            textAlign: 'center'
          }}
        >
          <img src="/images/bonsai.svg" alt="Bonsai" style={{ width: '30px', height: '30px' }}/>
          <div>Bonsai</div>
        </div>
        {/* Lantern */}
        <div 
          draggable 
          onDragStart={(e) => e.dataTransfer.setData("type", "lantern")}
          style={{
            padding: '8px',
            cursor: 'grab',
            border: '1px solid #ddd',
            margin: '5px',
            textAlign: 'center'
          }}
        >
          <img src="/images/lantern.svg" alt="Lantern" style={{ width: '30px', height: '30px' }}/>
          <div>Lantern</div>
        </div>
        {/* Pond */}
        <div 
          draggable 
          onDragStart={(e) => e.dataTransfer.setData("type", "pond")}
          style={{
            padding: '8px',
            cursor: 'grab',
            border: '1px solid #ddd',
            margin: '5px',
            textAlign: 'center'
          }}
        >
          <img src="/images/pond.svg" alt="Pond" style={{ width: '30px', height: '30px' }}/>
          <div>Pond</div>
        </div>
      </div>

      {/* Canevas interactif */}
      <div
        ref={canvasRef}
        className="canvas"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => setSelectedElement(null)}
        style={{
          flex: 1,
          height: '600px',
          border: '2px solid #000',
          position: 'relative',
          backgroundImage: 'url("/images/zenBackground.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {garden.children.map(element => (
          <div
            key={element.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
            style={{
              outline: selectedElement && selectedElement.id === element.id ? '2px solid red' : 'none'
            }}
          >
            {element.render()}
          </div>
        ))}

        {/* Affichage de l'animation de vent (Lottie) à une position aléatoire */}
        {isWindActive && (
          <div
            style={{
              position: 'absolute',
              top: windPosition.y,
              left: windPosition.x,
              width: '200px',
              height: '200px',
              pointerEvents: 'none'
            }}
          >
            <Lottie {...windAnimationOptions} />
          </div>
        )}
      </div>

      {/* Panneau de contrôle pour Undo/Redo et actions sur l'élément sélectionné */}
      <div style={{ marginLeft: '20px' }}>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <hr />
        {selectedElement && (
          <div>
            <div>Selected: {selectedElement.id}</div>
            <button onClick={() => moveSelectedElement(0, -MOVE_OFFSET)}>Up</button>
            <button onClick={() => moveSelectedElement(0, MOVE_OFFSET)}>Down</button>
            <button onClick={() => moveSelectedElement(-MOVE_OFFSET, 0)}>Left</button>
            <button onClick={() => moveSelectedElement(MOVE_OFFSET, 0)}>Right</button>
            <button onClick={removeSelectedElement}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZenGarden;
