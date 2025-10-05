import { useState, useCallback } from 'react';
import type { Circuit, Component, ComponentType } from '../types/circuit';
import { getComponentDefinition } from '../components/circuit/ComponentLibrary';

export const useCircuit = () => {
  const [circuit, setCircuit] = useState<Circuit>({
    id: 'main-circuit',
    name: 'Main Circuit',
    components: [
      // Add a test LED component for testing drag functionality
      {
        id: 'test-led-1',
        type: 'led',
        position: { x: 200, y: 150 },
        rotation: 0,
        pins: [
          { id: 'test-led-1-pin-0', name: 'Anode', type: 'input', position: { x: 0, y: 0 }, connected: false, value: false },
          { id: 'test-led-1-pin-1', name: 'Cathode', type: 'output', position: { x: 40, y: 0 }, connected: false, value: false },
        ],
        properties: { color: 'red', forwardVoltage: 2.1, isOn: false },
        label: 'LED',
      },
      // Add a test resistor for wiring
      {
        id: 'test-resistor-1',
        type: 'resistor',
        position: { x: 300, y: 250 },
        rotation: 0,
        pins: [
          { id: 'test-resistor-1-pin-0', name: 'A', type: 'bidirectional', position: { x: -30, y: 0 }, connected: false, value: false },
          { id: 'test-resistor-1-pin-1', name: 'B', type: 'bidirectional', position: { x: 30, y: 0 }, connected: false, value: false },
        ],
        properties: { value: '1k', tolerance: '5%' },
        label: 'Resistor',
      },
    ],
    wires: [],
    canvas: {
      scale: 1,
      offset: { x: 0, y: 0 },
    },
  });

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType | null>(null);
  
  // Wire connection state
  const [isWiring, setIsWiring] = useState(false);
  const [firstPinId, setFirstPinId] = useState<string | null>(null);

  const addComponent = useCallback((type: ComponentType, x: number, y: number) => {
    const definition = getComponentDefinition(type);
    if (!definition) return;

    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x, y },
      rotation: 0,
      pins: definition.pins.map((pin, index) => ({
        ...pin,
        id: `${type}-${Date.now()}-pin-${index}`,
        connected: false,
        value: false,
      })),
      properties: { ...definition.defaultProperties },
      label: definition.name,
    };

    setCircuit(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));

    return newComponent.id;
  }, []);

  const removeComponent = useCallback((componentId: string) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== componentId),
      wires: prev.wires.filter(w => 
        !prev.components.find(c => c.id === componentId)?.pins.some(p => 
          p.id === w.fromPin || p.id === w.toPin
        )
      ),
    }));

    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const moveComponent = useCallback((componentId: string, x: number, y: number) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(c =>
        c.id === componentId ? { ...c, position: { x, y } } : c
      ),
    }));
  }, []);

  const updateCircuitCanvas = useCallback((updates: Partial<Circuit['canvas']>) => {
    setCircuit(prev => ({
      ...prev,
      canvas: { ...prev.canvas, ...updates },
    }));
  }, []);

  const selectComponent = useCallback((componentId: string | null) => {
    setSelectedComponentId(componentId);
  }, []);

  const selectComponentType = useCallback((componentType: ComponentType | null) => {
    setSelectedComponentType(componentType);
  }, []);

  const startWiring = useCallback((pinId: string) => {
    setIsWiring(true);
    setFirstPinId(pinId);
    setSelectedComponentId(null); // Clear component selection when wiring
  }, []);

  const completeWiring = useCallback((secondPinId: string) => {
    if (!firstPinId || firstPinId === secondPinId) {
      // Cancel wiring if no first pin or trying to connect to same pin
      setIsWiring(false);
      setFirstPinId(null);
      return;
    }

    // Update circuit with new wire and mark pins as connected
    setCircuit(prev => {
      // Find the components and pins from current state
      const firstPin = prev.components
        .flatMap(c => c.pins.map(p => ({ ...p, componentId: c.id })))
        .find(p => p.id === firstPinId);
      
      const secondPin = prev.components
        .flatMap(c => c.pins.map(p => ({ ...p, componentId: c.id })))
        .find(p => p.id === secondPinId);

      if (!firstPin || !secondPin) {
        return prev;
      }

      // Don't allow connecting pins on the same component
      if (firstPin.componentId === secondPin.componentId) {
        return prev;
      }

      // Create new wire
      const newWire = {
        id: `wire-${Date.now()}`,
        fromPin: firstPinId,
        toPin: secondPinId,
        points: [
          firstPin.position,
          secondPin.position,
        ],
      };

      return {
        ...prev,
        wires: [...prev.wires, newWire],
        components: prev.components.map(component => ({
          ...component,
          pins: component.pins.map(pin => ({
            ...pin,
            connected: pin.id === firstPinId || pin.id === secondPinId ? true : pin.connected,
          })),
        })),
      };
    });

    // Reset wiring state
    setIsWiring(false);
    setFirstPinId(null);
  }, [firstPinId]);

  const cancelWiring = useCallback(() => {
    setIsWiring(false);
    setFirstPinId(null);
  }, []);

  const handlePinClick = useCallback((pinId: string, _componentId: string) => {
    if (!isWiring) {
      // Start wiring from this pin
      startWiring(pinId);
    } else {
      // Complete wiring to this pin
      completeWiring(pinId);
    }
  }, [isWiring, startWiring, completeWiring]);

  return {
    circuit,
    setCircuit,
    selectedComponentId,
    selectedComponentType,
    addComponent,
    removeComponent,
    moveComponent,
    updateCircuitCanvas,
    selectComponent,
    selectComponentType,
    // Wire connection functions
    isWiring,
    firstPinId,
    handlePinClick,
    cancelWiring,
  };
};