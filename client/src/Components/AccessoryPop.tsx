import React, { useState } from 'react';
import Accessory from './Accessory'; 
import './Accessories.css'; 

interface Accessory {
  id: number;
  name: string;
  imageUrl: string;
}

const Accessories: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([
    { id: 1, name: 'Accessory 1', imageUrl: 'url1' },
    { id: 2, name: 'Accessory 2', imageUrl: 'url2' },
    // Add more accessories as needed
  ]);

  return (
    <div className="accessories-container">
      {accessories.map(accessory => (
        <Accessory key={accessory.id} accessory={accessory} />
      ))}
    </div>
  );
}

export default Accessories;
