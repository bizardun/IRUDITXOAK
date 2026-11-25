import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import api from '../../services/api';

interface EditablePriceProps {
    price: number | string;
    id?: number; 
    onUpdate: () => void;
    onSave?: (newPrice: number | string) => Promise<void>;
}

export const EditablePrice: React.FC<EditablePriceProps> = ({ price, id, onUpdate, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(typeof price === 'number' ? price.toFixed(2) : String(price));
    const { config } = useConfig();
    const isDarkTheme = config?.name?.toLowerCase().includes('kanala') || Boolean(config?.theme?.customColors?.isDark);

    useEffect(() => setVal(typeof price === 'number' ? price.toFixed(2) : String(price)), [price]);

    const save = async () => {
        setIsEditing(false);
        const trimmed = val.trim();
        let nextVal: number | string | null = null;
        if (trimmed.includes('/')) {
            nextVal = trimmed;
        } else {
            const num = parseFloat(trimmed.replace(/€/g, '').replace(',', '.'));
            if (!isNaN(num)) nextVal = num;
        }
        if (nextVal !== null && nextVal !== price) {
            if (onSave) {
                await onSave(nextVal);
            } else if (id !== undefined) {
                await api.updatePlato(id, { Precio: nextVal });
            }
            onUpdate();
        } else {
            setVal(typeof price === 'number' ? price.toFixed(2) : String(price));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') save();
    }

    if (isEditing) {
        return (
            <input 
                autoFocus 
                type="text" 
                value={val} 
                onChange={e => setVal(e.target.value)} 
                onFocus={(e) => e.target.select()}
                onBlur={save} 
                onKeyDown={handleKeyDown}
                className={`w-24 px-1.5 py-0.5 text-sm font-bold border-2 rounded shadow-sm focus:outline-none ${isDarkTheme ? "text-white bg-neutral-900 border-white/50" : "text-black bg-white border-blue-400"}`} 
            />
        );
    }
    return <span onClick={() => setIsEditing(true)} className={`cursor-pointer border px-2 py-1 rounded-md transition-colors shadow-sm text-sm font-medium whitespace-nowrap ${isDarkTheme ? "border-white/20 bg-neutral-900 text-white hover:border-white/60 hover:bg-white/10" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"}`}>{typeof price === 'number' ? `€${price.toFixed(2)}` : price}</span>;
};