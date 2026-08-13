
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import type { Plato } from '../types';

interface DataContextType {
    platos: Plato[];
    menuPrice: number;
    loading: boolean;
    refreshData: () => Promise<void>;
    updateLocalPlato: (id: number, data: Partial<Plato>) => void;
    reorderPlatos: (newOrder: Plato[]) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [menuPrice, setMenuPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        // Now handled by realtime subscriptions
    }, []);

    // Optimistic update helper
    const updateLocalPlato = (id: number, data: Partial<Plato>) => {
        setPlatos(prev => prev.map(p => p.ID_Plato === id ? { ...p, ...data } : p));
    };

    const reorderPlatos = async (newOrder: Plato[]) => {
        setPlatos(newOrder); // Optimistic
        await api.updatePlatosOrder(newOrder);
    };

    useEffect(() => {
        let isFirstLoad = true;
        
        const unsubPlatos = api.subscribeToPlatos((newPlatos) => {
            setPlatos(newPlatos);
            if (isFirstLoad) {
                setLoading(false);
                isFirstLoad = false;
            }
        });
        
        const unsubPrice = api.subscribeToMenuPrice((newPrice) => {
            setMenuPrice(newPrice);
        });

        return () => {
            unsubPlatos();
            unsubPrice();
        };
    }, []);

    return (
        <DataContext.Provider value={{ platos, menuPrice, loading, refreshData, updateLocalPlato, reorderPlatos }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
};
