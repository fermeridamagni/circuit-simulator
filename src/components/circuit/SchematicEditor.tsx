import React, { useRef, useCallback, useState } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import Konva from 'konva';
import { ComponentRenderer } from './ComponentRenderer';
import { WireRenderer } from './WireRenderer';
import type { Circuit } from '../../types/circuit';

interface SchematicEditorProps {
  circuit: Circuit;
  onCircuitChange: (circuit: Circuit) => void;
  width: number;
  height: number;
  selectedComponentId?: string | null;
  selectedComponentType?: string | null;
  onComponentSelect?: (id: string | null) => void;
  onComponentAdd?: (type: string, x: number, y: number) => void;
  onComponentMove?: (id: string, x: number, y: number) => void;
  onPinClick?: (pinId: string, componentId: string) => void;
  isWiring?: boolean;
  selectedWireId?: string | null;
}

const GRID_SIZE = 20;
const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

export const SchematicEditor: React.FC<SchematicEditorProps> = ({
  circuit,
  onCircuitChange,
  width,
  height,
  selectedComponentId,
  selectedComponentType,
  onComponentSelect,
  onComponentAdd,
  onComponentMove,
  onPinClick,
  isWiring = false,
  selectedWireId,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle stage pan and zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const scaleBy = 1.1;
    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy)
    );

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);

    // Update circuit state
    onCircuitChange({
      ...circuit,
      canvas: {
        scale: newScale,
        offset: newPos,
      },
    });
  }, [circuit, onCircuitChange]);

  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Check if we clicked on the stage (background)
    if (e.target === stageRef.current) {
      if (selectedComponentType && onComponentAdd) {
        // Add component at clicked position
        const stage = stageRef.current;
        const pointer = stage.getPointerPosition();
        if (pointer) {
          // Convert screen coordinates to canvas coordinates
          const transform = stage.getAbsoluteTransform().copy().invert();
          const canvasPos = transform.point(pointer);
          onComponentAdd(selectedComponentType, canvasPos.x, canvasPos.y);
        }
      } else {
        // Start panning
        setIsDragging(true);
        // Clear component selection
        onComponentSelect?.(null);
      }
    }
  }, [selectedComponentType, onComponentAdd, onComponentSelect]);

  const handleStageMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDragging) return;
    
    const stage = e.target.getStage();
    if (!stage) return;

    // Pan the stage
    const newPos = {
      x: stage.x() + e.evt.movementX,
      y: stage.y() + e.evt.movementY,
    };

    stage.position(newPos);
    
    // Update circuit state
    onCircuitChange({
      ...circuit,
      canvas: {
        ...circuit.canvas,
        offset: newPos,
      },
    });
  }, [isDragging, circuit, onCircuitChange]);

  const handleStageMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Grid rendering
  const renderGrid = () => {
    const lines = [];
    const scale = circuit.canvas.scale;
    const offset = circuit.canvas.offset;
    
    // Only render grid if scale is large enough
    if (scale < 0.5) return null;

    const startX = Math.floor((-offset.x) / (GRID_SIZE * scale)) * GRID_SIZE;
    const startY = Math.floor((-offset.y) / (GRID_SIZE * scale)) * GRID_SIZE;
    const endX = startX + Math.ceil(width / scale) + GRID_SIZE;
    const endY = startY + Math.ceil(height / scale) + GRID_SIZE;

    // Vertical lines
    for (let x = startX; x <= endX; x += GRID_SIZE) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={startY}
          x2={x}
          y2={endY}
          stroke="#e0e0e0"
          strokeWidth={0.5 / scale}
        />
      );
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += GRID_SIZE) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth={0.5 / scale}
        />
      );
    }

    return <>{lines}</>;
  };

  return (
    <div className={`w-full h-full ${selectedComponentType ? 'cursor-crosshair' : ''} ${isWiring ? 'cursor-pointer' : ''}`}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={circuit.canvas.scale}
        scaleY={circuit.canvas.scale}
        x={circuit.canvas.offset.x}
        y={circuit.canvas.offset.y}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        draggable={false}
      >
        {/* Grid Layer */}
        <Layer>
          <Group>{renderGrid()}</Group>
        </Layer>

        {/* Components Layer */}
        <Layer>
          {circuit.components.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={onComponentSelect}
              onDrag={onComponentMove}
              onPinClick={onPinClick}
              showPins={isWiring}
            />
          ))}
        </Layer>

        {/* Wires Layer */}
        <Layer>
          {circuit.wires.map((wire) => (
            <WireRenderer
              key={wire.id}
              wire={wire}
              components={circuit.components}
              isSelected={selectedWireId === wire.id}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};