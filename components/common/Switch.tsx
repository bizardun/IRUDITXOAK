import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: () => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => (
    <button type="button" onClick={onChange} className={`${checked ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
        <span className="sr-only">Toggle</span>
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);

export default Switch;
