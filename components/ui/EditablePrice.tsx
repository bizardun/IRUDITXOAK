import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import api from '../../services/api';

interface EditablePriceProps {
    price: number;
    id?: number; 
    onUpdate: () => void;
    onSave?: (newPrice: number) => Promise<void>;
}

export const EditablePrice: React.FC<EditablePriceProps> = ({ price, id, onUpdate, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(price.toFixed(2));
    const { config } = useConfig();
    const isKanala = config?.name?.toLowerCase().includes('kanala') || false;

    useEffect(() => setVal(price.toFixed(2)), [price]);

    const save = async () => {
        setIsEditing(false);
        const num = parseFloat(val.replace(',', '.')); // Permitir comas
        if (!isNaN(num) && num !== price) {
            if (onSave) {
                await onSave(num);
            } else if (id !== undefined) {
                await api.updatePlato(id, { Precio: num });
            }
            onUpdate();
        } else {
            setVal(price.toFixed(2));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') save();
    }

    if (isEditing) {
        return (
            <input 
                autoFocus 
                type="number" 
                step="0.01" 
                value={val} 
                onChange={e => setVal(e.target.value)} 
                onFocus={(e) => e.target.select()}
                onBlur={save} 
                onKeyDown={handleKeyDown}
                className={`w-20 px-1 py-0.5 text-sm font-bold border-2 rounded shadow-sm focus:outline-none ${isKanala ? "text-white bg-neutral-900 border-white/50" : "text-black bg-white border-blue-400"}`} 
            />
        );
    }
    return <span onClick={() => setIsEditing(true)} className={`cursor-pointer border px-2 py-1 rounded-md transition-colors shadow-sm text-sm font-medium ${isKanala ? "border-white/20 bg-neutral-900 text-white hover:border-white/60 hover:bg-white/10" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"}`}>€{price.toFixed(2)}</span>;
};