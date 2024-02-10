// Accessory.tsx

import React from 'react';

interface AccessoryProps {
  accessory: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

const Accessory: React.FC<AccessoryProps> = ({ accessory }) => {
  return (
    <div className="accessory">
      <img src={accessory.imageUrl} alt={accessory.name} />
      <p>{accessory.name}</p>
    </div>
  );
};

export default Accessory;
