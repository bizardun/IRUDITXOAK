import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface EditablePriceProps {
    initialPrice: number;
    platoId: number;
    refreshData: () => void;
}

const EditablePrice: React.FC<EditablePriceProps> = ({ initialPrice, platoId, refreshData }) => {
    const [price, setPrice] = useState(initialPrice.toFixed(2));
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setPrice(initialPrice.toFixed(2));
    }, [initialPrice]);

    const handleBlur = async () => {
        setIsEditing(false);
        const newPrice = parseFloat(price);
        if (!isNaN(newPrice) && newPrice !== initialPrice) {
            await api.updatePlato(platoId, { Precio: newPrice });
            await refreshData();
        } else {
            setPrice(initialPrice.toFixed(2));
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    }

    if (initialPrice === 0) return <span className="text-gray-500">S/M</span>; 

    return isEditing ? (
        <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-20 px-1 py-0.5 border border-blue-300 rounded-md text-sm bg-white text-slate-900 font-bold shadow-inner"
        />
    ) : (
        <span onClick={() => setIsEditing(true)} className="cursor-pointer hover:bg-gray-100 px-1 rounded">
             {`€${initialPrice.toFixed(2)}`}
        </span>
    );
};

export default EditablePrice;