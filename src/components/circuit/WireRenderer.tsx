import type React from 'react';
import { Group, Line } from 'react-konva';
import type { Wire, Component } from '../../types/circuit';

interface WireRendererProps {
  wire: Wire;
  components: Component[];
  isSelected?: boolean;
  onSelect?: (wireId: string) => void;
}

export const WireRenderer: React.FC<WireRendererProps> = ({
  wire,
  components,
  isSelected = false,
  onSelect,
}) => {
  // Find the actual pin positions from components
  const getAbsolutePinPosition = (pinId: string): { x: number, y: number } => {
    for (const component of components) {
      const pin = component.pins.find(p => p.id === pinId);
      if (pin) {
        return {
          x: component.position.x + pin.position.x,
          y: component.position.y + pin.position.y,
        };
      }
    }
    return { x: 0, y: 0 };
  };

  const fromPos = getAbsolutePinPosition(wire.fromPin);
  const toPos = getAbsolutePinPosition(wire.toPin);

  // Create a simple straight line for now
  // Later we can add more sophisticated routing
  const points = [fromPos.x, fromPos.y, toPos.x, toPos.y];

  const handleClick = () => {
    onSelect?.(wire.id);
  };

  return (
    <Group>
      {/* Main wire line */}
      <Line
        points={points}
        stroke={isSelected ? 'blue' : 'black'}
        strokeWidth={isSelected ? 3 : 2}
        onClick={handleClick}
        onTap={handleClick}
      />
      
      {/* Connection points */}
      <Line
        points={[fromPos.x - 3, fromPos.y - 3, fromPos.x + 3, fromPos.y + 3, fromPos.x - 3, fromPos.y + 3, fromPos.x + 3, fromPos.y - 3]}
        stroke="green"
        strokeWidth={1}
        closed={false}
      />
      <Line
        points={[toPos.x - 3, toPos.y - 3, toPos.x + 3, toPos.y + 3, toPos.x - 3, toPos.y + 3, toPos.x + 3, toPos.y - 3]}
        stroke="green"
        strokeWidth={1}
        closed={false}
      />
    </Group>
  );
};