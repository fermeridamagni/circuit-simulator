import { useCallback, useEffect, useState } from 'react';
import { SchematicEditor } from './components/circuit/SchematicEditor';
import { ComponentPalette } from './components/ui/ComponentPalette';
import { useCircuit } from './hooks/useCircuit';
import type { ComponentType } from './types/circuit';

function App() {
  const {
    circuit,
    setCircuit,
    selectedComponentId,
    selectedComponentType,
    addComponent,
    moveComponent,
    selectComponent,
    selectComponentType,
    isWiring,
    firstPinId,
    handlePinClick,
    cancelWiring,
  } = useCircuit();

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Handle window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const sidebar = 300; // Approximate sidebar width
      const toolbar = 60;  // Approximate toolbar height
      setCanvasSize({
        width: Math.max(600, window.innerWidth - sidebar),
        height: Math.max(400, window.innerHeight - toolbar),
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleComponentTypeSelect = useCallback((type: ComponentType) => {
    selectComponentType(type);
  }, [selectComponentType]);



  const handleCircuitChange = useCallback((updatedCircuit: typeof circuit) => {
    setCircuit(updatedCircuit);
  }, [setCircuit]);

  const handleComponentAdd = useCallback((type: string, x: number, y: number) => {
    addComponent(type as ComponentType, x, y);
    // Clear selection after adding
    selectComponentType(null);
  }, [addComponent, selectComponentType]);

  const handleComponentMove = useCallback((componentId: string, x: number, y: number) => {
    moveComponent(componentId, x, y);
  }, [moveComponent]);

  const handleComponentSelect = useCallback((componentId: string | null) => {
    selectComponent(componentId);
  }, [selectComponent]);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">PIC16 Circuit Simulator</h1>
        <div className="flex gap-2">
          <button 
            type="button" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-md text-sm font-medium"
          >
            Load HEX
          </button>
          <button 
            type="button" 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all hover:-translate-y-0.5 hover:shadow-md text-sm font-medium"
          >
            Run
          </button>
          <button 
            type="button" 
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all hover:-translate-y-0.5 hover:shadow-md text-sm font-medium"
          >
            Pause
          </button>
          <button 
            type="button" 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-md text-sm font-medium"
          >
            Step
          </button>
          <button 
            type="button" 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all hover:-translate-y-0.5 hover:shadow-md text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <ComponentPalette
            onComponentSelect={handleComponentTypeSelect}
            selectedComponent={selectedComponentType}
          />
          
          <div className="p-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Properties</h3>
            {selectedComponentId ? (
              <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                {(() => {
                  const component = circuit.components.find(c => c.id === selectedComponentId);
                  if (!component) return <p className="text-gray-600">Component not found</p>;
                  
                  return (
                    <>
                      <p className="text-gray-700"><strong className="font-semibold">Type:</strong> {component.type}</p>
                      <p className="text-gray-700"><strong className="font-semibold">ID:</strong> {component.id}</p>
                      <p className="text-gray-700"><strong className="font-semibold">Position:</strong> ({Math.round(component.position.x)}, {Math.round(component.position.y)})</p>
                      <p className="text-gray-700"><strong className="font-semibold">Pins:</strong> {component.pins.length}</p>
                      {Object.entries(component.properties).map(([key, value]) => (
                        <p key={key} className="text-gray-700"><strong className="font-semibold">{key}:</strong> {String(value)}</p>
                      ))}
                    </>
                  );
                })()}
              </div>
            ) : isWiring ? (
              <div className="p-3 bg-blue-50 rounded-lg text-sm space-y-2">
                <p className="font-semibold text-blue-900">Wiring Mode</p>
                <p className="text-blue-800">Starting from pin: {firstPinId ? firstPinId.split('-').pop() : 'Unknown'}</p>
                <p className="text-blue-700">Click on another pin to complete the connection</p>
                <button 
                  type="button" 
                  onClick={cancelWiring} 
                  className="mt-2 w-full px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Cancel Wiring
                </button>
              </div>
            ) : selectedComponentType ? (
              <div className="p-3 bg-green-50 rounded-lg text-sm space-y-2">
                <p className="text-green-900"><strong className="font-semibold">Placing:</strong> {selectedComponentType}</p>
                <p className="text-green-700">Click on the canvas to place the component</p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                <p className="text-gray-700">Select a component from the palette or click on a component to view its properties</p>
                <p className="text-gray-700"><strong className="font-semibold">Wiring:</strong> Click on a pin to start connecting wires</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white relative">
          <SchematicEditor
            circuit={circuit}
            onCircuitChange={handleCircuitChange}
            width={canvasSize.width}
            height={canvasSize.height}
            selectedComponentId={selectedComponentId}
            selectedComponentType={selectedComponentType}
            onComponentSelect={handleComponentSelect}
            onComponentAdd={handleComponentAdd}
            onComponentMove={handleComponentMove}
            onPinClick={handlePinClick}
            isWiring={isWiring}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
