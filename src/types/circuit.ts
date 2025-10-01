export interface Point {
  x: number;
  y: number;
}

export interface Pin {
  id: string;
  name: string;
  type: 'input' | 'output' | 'bidirectional' | 'power' | 'ground';
  position: Point;
  connected?: boolean;
  value?: boolean; // For digital pins
}

export interface Component {
  id: string;
  type: string;
  position: Point;
  rotation: number;
  pins: Pin[];
  properties: Record<string, any>;
  label?: string;
}

export interface Wire {
  id: string;
  fromPin: string;
  toPin: string;
  points: Point[];
}

export interface Circuit {
  id: string;
  name: string;
  components: Component[];
  wires: Wire[];
  canvas: {
    scale: number;
    offset: Point;
  };
}

export type ComponentType = 
  | 'resistor'
  | 'led'
  | 'capacitor'
  | 'inductor'
  | 'pic16'
  | 'ground'
  | 'vcc'
  | 'probe';

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  width: number;
  height: number;
  pins: Omit<Pin, 'id' | 'connected' | 'value'>[];
  defaultProperties: Record<string, any>;
}