import type { ComponentDefinition } from '../../types/circuit';

export const COMPONENT_DEFINITIONS: Record<string, ComponentDefinition> = {
  resistor: {
    type: 'resistor',
    name: 'Resistor',
    width: 60,
    height: 20,
    pins: [
      { name: 'A', type: 'bidirectional', position: { x: 0, y: 0 } },
      { name: 'B', type: 'bidirectional', position: { x: 60, y: 0 } },
    ],
    defaultProperties: {
      value: '1k',
      tolerance: '5%',
    },
  },
  
  led: {
    type: 'led',
    name: 'LED',
    width: 40,
    height: 40,
    pins: [
      { name: 'Anode', type: 'input', position: { x: 0, y: 0 } },
      { name: 'Cathode', type: 'output', position: { x: 40, y: 0 } },
    ],
    defaultProperties: {
      color: 'red',
      forwardVoltage: 2.1,
    },
  },

  capacitor: {
    type: 'capacitor',
    name: 'Capacitor',
    width: 30,
    height: 50,
    pins: [
      { name: 'Positive', type: 'bidirectional', position: { x: 0, y: 0 } },
      { name: 'Negative', type: 'bidirectional', position: { x: 30, y: 0 } },
    ],
    defaultProperties: {
      value: '100μF',
      voltage: '25V',
    },
  },

  ground: {
    type: 'ground',
    name: 'Ground',
    width: 30,
    height: 30,
    pins: [
      { name: 'GND', type: 'ground', position: { x: 15, y: 0 } },
    ],
    defaultProperties: {},
  },

  vcc: {
    type: 'vcc',
    name: 'VCC',
    width: 30,
    height: 30,
    pins: [
      { name: 'VCC', type: 'power', position: { x: 15, y: 30 } },
    ],
    defaultProperties: {
      voltage: '5V',
    },
  },

  pic16: {
    type: 'pic16',
    name: 'PIC16F84A',
    width: 120,
    height: 200,
    pins: [
      // Left side pins (1-9)
      { name: 'RA2', type: 'bidirectional', position: { x: 0, y: 20 } },
      { name: 'RA3', type: 'bidirectional', position: { x: 0, y: 40 } },
      { name: 'RA4/T0CKI', type: 'bidirectional', position: { x: 0, y: 60 } },
      { name: 'MCLR', type: 'input', position: { x: 0, y: 80 } },
      { name: 'VSS', type: 'ground', position: { x: 0, y: 100 } },
      { name: 'RB0/INT', type: 'bidirectional', position: { x: 0, y: 120 } },
      { name: 'RB1', type: 'bidirectional', position: { x: 0, y: 140 } },
      { name: 'RB2', type: 'bidirectional', position: { x: 0, y: 160 } },
      { name: 'RB3', type: 'bidirectional', position: { x: 0, y: 180 } },
      
      // Right side pins (10-18)
      { name: 'RB4', type: 'bidirectional', position: { x: 120, y: 180 } },
      { name: 'RB5', type: 'bidirectional', position: { x: 120, y: 160 } },
      { name: 'RB6', type: 'bidirectional', position: { x: 120, y: 140 } },
      { name: 'RB7', type: 'bidirectional', position: { x: 120, y: 120 } },
      { name: 'VDD', type: 'power', position: { x: 120, y: 100 } },
      { name: 'OSC2', type: 'output', position: { x: 120, y: 80 } },
      { name: 'OSC1', type: 'input', position: { x: 120, y: 60 } },
      { name: 'RA0', type: 'bidirectional', position: { x: 120, y: 40 } },
      { name: 'RA1', type: 'bidirectional', position: { x: 120, y: 20 } },
    ],
    defaultProperties: {
      model: 'PIC16F84A',
      clockFrequency: '4MHz',
    },
  },

  probe: {
    type: 'probe',
    name: 'Probe',
    width: 20,
    height: 20,
    pins: [
      { name: 'Input', type: 'input', position: { x: 0, y: 10 } },
    ],
    defaultProperties: {
      color: 'yellow',
    },
  },
};

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return COMPONENT_DEFINITIONS[type];
}