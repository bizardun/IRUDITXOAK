import React from 'react';
export const Switch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button type="button" onClick={onChange} className={`${checked ? 'bg-emerald-500' : 'bg-slate-200'} relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}>
        <span className={`${checked ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
    </button>
);