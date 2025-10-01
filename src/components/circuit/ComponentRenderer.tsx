import type React from 'react';
import { Group, Rect, Circle, Line, Text } from 'react-konva';
import type { Component } from '../../types/circuit';

interface ComponentRendererProps {
  component: Component;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDrag?: (id: string, x: number, y: number) => void;
  onPinClick?: (pinId: string, componentId: string) => void;
  showPins?: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onSelect,
  onDrag,
  onPinClick,
  showPins = false,
}) => {
  const handleClick = () => {
    onSelect?.(component.id);
  };

  const handleDragMove = (e: { target: { x: () => number; y: () => number } }) => {
    onDrag?.(component.id, e.target.x(), e.target.y());
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'resistor':
        return renderResistor();
      case 'led':
        return renderLED();
      case 'capacitor':
        return renderCapacitor();
      case 'ground':
        return renderGround();
      case 'vcc':
        return renderVCC();
      case 'pic16':
        return renderPIC16();
      case 'probe':
        return renderProbe();
      default:
        return renderGeneric();
    }
  };

  const renderResistor = () => (
    <Group>
      {/* Resistor body */}
      <Rect
        width={60}
        height={20}
        x={-30}
        y={-10}
        fill="white"
        stroke="black"
        strokeWidth={2}
      />
      {/* Zigzag pattern */}
      <Line
        points={[-25, 0, -20, -5, -15, 5, -10, -5, -5, 5, 0, -5, 5, 5, 10, -5, 15, 5, 20, -5, 25, 0]}
        stroke="black"
        strokeWidth={2}
      />
      {/* Connection lines */}
      <Line points={[-50, 0, -30, 0]} stroke="black" strokeWidth={2} />
      <Line points={[30, 0, 50, 0]} stroke="black" strokeWidth={2} />
      {/* Value label */}
      <Text
        text={component.properties.value || '1k'}
        x={-15}
        y={15}
        fontSize={12}
        fill="black"
      />
    </Group>
  );

  const renderLED = () => (
    <Group>
      {/* LED body (triangle + line) */}
      <Line
        points={[-10, -15, 10, 0, -10, 15, -10, -15]}
        fill="white"
        stroke="black"
        strokeWidth={2}
        closed={true}
      />
      <Line points={[10, -15, 10, 15]} stroke="black" strokeWidth={2} />
      
      {/* Connection lines */}
      <Line points={[-30, 0, -10, 0]} stroke="black" strokeWidth={2} />
      <Line points={[10, 0, 30, 0]} stroke="black" strokeWidth={2} />
      
      {/* Light rays when active */}
      {component.properties.isOn && (
        <>
          <Line points={[15, -10, 25, -15]} stroke="yellow" strokeWidth={1} />
          <Line points={[15, -5, 25, -5]} stroke="yellow" strokeWidth={1} />
          <Line points={[15, 5, 25, 5]} stroke="yellow" strokeWidth={1} />
          <Line points={[15, 10, 25, 15]} stroke="yellow" strokeWidth={1} />
        </>
      )}
      
      {/* Color indicator */}
      <Circle
        x={0}
        y={0}
        radius={3}
        fill={component.properties.isOn ? component.properties.color : 'gray'}
      />
    </Group>
  );

  const renderCapacitor = () => (
    <Group>
      {/* Capacitor plates */}
      <Line points={[-5, -20, -5, 20]} stroke="black" strokeWidth={3} />
      <Line points={[5, -20, 5, 20]} stroke="black" strokeWidth={3} />
      
      {/* Connection lines */}
      <Line points={[-25, 0, -5, 0]} stroke="black" strokeWidth={2} />
      <Line points={[5, 0, 25, 0]} stroke="black" strokeWidth={2} />
      
      {/* Value label */}
      <Text
        text={component.properties.value || '100μF'}
        x={-20}
        y={25}
        fontSize={10}
        fill="black"
      />
    </Group>
  );

  const renderGround = () => (
    <Group>
      {/* Ground symbol */}
      <Line points={[0, -15, 0, 0]} stroke="black" strokeWidth={2} />
      <Line points={[-15, 0, 15, 0]} stroke="black" strokeWidth={3} />
      <Line points={[-10, 5, 10, 5]} stroke="black" strokeWidth={2} />
      <Line points={[-5, 10, 5, 10]} stroke="black" strokeWidth={1} />
    </Group>
  );

  const renderVCC = () => (
    <Group>
      {/* VCC symbol */}
      <Line points={[0, 15, 0, 0]} stroke="black" strokeWidth={2} />
      <Circle x={0} y={-5} radius={8} fill="white" stroke="black" strokeWidth={2} />
      <Text text="+" x={-3} y={-8} fontSize={12} fill="black" fontStyle="bold" />
      <Text
        text={component.properties.voltage || '5V'}
        x={-8}
        y={-25}
        fontSize={10}
        fill="black"
      />
    </Group>
  );

  const renderPIC16 = () => (
    <Group>
      {/* IC body */}
      <Rect
        width={120}
        height={200}
        x={-60}
        y={-100}
        fill="black"
        stroke="black"
        strokeWidth={2}
        cornerRadius={5}
      />
      
      {/* IC label */}
      <Text
        text="PIC16F84A"
        x={-35}
        y={-10}
        fontSize={12}
        fill="white"
        fontFamily="monospace"
      />
      
      {/* Pin indicators - Left side */}
      {component.pins.slice(0, 9).map((pin, index) => (
        <Group key={pin.name}>
          <Circle
            x={-60}
            y={-80 + index * 20}
            radius={4}
            fill="silver"
            stroke="black"
            strokeWidth={1}
          />
          <Text
            text={pin.name}
            x={-55}
            y={-85 + index * 20}
            fontSize={8}
            fill="white"
            fontFamily="monospace"
          />
        </Group>
      ))}
      
      {/* Pin indicators - Right side */}
      {component.pins.slice(9).map((pin, index) => (
        <Group key={pin.name}>
          <Circle
            x={60}
            y={80 - index * 20}
            radius={4}
            fill="silver"
            stroke="black"
            strokeWidth={1}
          />
          <Text
            text={pin.name}
            x={20}
            y={75 - index * 20}
            fontSize={8}
            fill="white"
            fontFamily="monospace"
            align="right"
          />
        </Group>
      ))}
      
      {/* Notch indicator */}
      <Circle x={0} y={-95} radius={5} fill="white" />
    </Group>
  );

  const renderProbe = () => (
    <Group>
      <Circle
        x={0}
        y={0}
        radius={10}
        fill={component.properties.color || 'yellow'}
        stroke="black"
        strokeWidth={2}
      />
      <Text
        text="P"
        x={-3}
        y={-4}
        fontSize={10}
        fill="black"
        fontStyle="bold"
      />
    </Group>
  );

  const renderGeneric = () => (
    <Group>
      <Rect
        width={40}
        height={40}
        x={-20}
        y={-20}
        fill="lightgray"
        stroke="black"
        strokeWidth={2}
      />
      <Text
        text="?"
        x={-5}
        y={-8}
        fontSize={16}
        fill="black"
      />
    </Group>
  );

  const renderPins = () => {
    if (!showPins && !isSelected) return null;

    return component.pins.map((pin) => (
      <Group key={pin.id}>
        <Circle
          x={pin.position.x}
          y={pin.position.y}
          radius={4}
          fill={pin.connected ? 'green' : 'silver'}
          stroke={pin.connected ? 'darkgreen' : 'gray'}
          strokeWidth={1}
          onClick={(e) => {
            e.cancelBubble = true;
            onPinClick?.(pin.id, component.id);
          }}
          onTap={(e) => {
            e.cancelBubble = true;
            onPinClick?.(pin.id, component.id);
          }}
          onMouseEnter={(e) => {
            e.target.scale({ x: 1.5, y: 1.5 });
          }}
          onMouseLeave={(e) => {
            e.target.scale({ x: 1, y: 1 });
          }}
        />
        {(showPins || isSelected) && (
          <Text
            text={pin.name}
            x={pin.position.x + 8}
            y={pin.position.y - 4}
            fontSize={8}
            fill="blue"
            fontStyle="bold"
          />
        )}
      </Group>
    ));
  };

  return (
    <Group
      x={component.position.x}
      y={component.position.y}
      rotation={component.rotation}
      draggable={true}
      onDragMove={handleDragMove}
      onClick={handleClick}
      onTap={handleClick}
    >
      {renderComponent()}
      {renderPins()}
      
      {/* Selection indicator */}
      {isSelected && (
        <Rect
          width={140}
          height={220}
          x={-70}
          y={-110}
          stroke="blue"
          strokeWidth={2}
          dash={[5, 5]}
          fill="transparent"
        />
      )}
    </Group>
  );
};