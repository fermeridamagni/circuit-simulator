import type React from 'react';
import { Plus, Cpu, Zap, Circle, Square, Triangle, Minus, Gauge } from 'lucide-react';
import type { ComponentType } from '../../types/circuit';

interface ComponentPaletteProps {
  onComponentSelect: (type: ComponentType) => void;
  selectedComponent?: ComponentType | null;
}

const COMPONENT_ITEMS = [
  { type: 'resistor' as ComponentType, name: 'Resistor', icon: Square },
  { type: 'led' as ComponentType, name: 'LED', icon: Triangle },
  { type: 'capacitor' as ComponentType, name: 'Capacitor', icon: Circle },
  { type: 'pic16' as ComponentType, name: 'PIC16', icon: Cpu },
  { type: 'ground' as ComponentType, name: 'Ground', icon: Minus },
  { type: 'vcc' as ComponentType, name: 'VCC', icon: Zap },
  { type: 'probe' as ComponentType, name: 'Probe', icon: Gauge },
];

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onComponentSelect,
  selectedComponent,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Components</h3>
        <Plus size={16} className="text-gray-600" />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {COMPONENT_ITEMS.map(({ type, name, icon: Icon }) => (
          <button
            key={type}
            type="button"
            className={`flex flex-col items-center p-3 border rounded-lg transition-all cursor-pointer ${
              selectedComponent === type
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-gray-50'
            }`}
            onClick={() => onComponentSelect(type)}
            title={name}
          >
            <Icon size={20} />
            <span className="text-xs mt-1 text-center">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};