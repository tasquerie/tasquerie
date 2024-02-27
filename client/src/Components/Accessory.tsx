// Accessory.tsx

import React from 'react';

export interface Accessory {
  name: string;
  imgUrl: string;
  location: [number, number];
  scale: number;
}

export function dressEgg(accessory: Accessory) {
  // console.log('dressEgg called');
  return (
      <img
      key={accessory.name}
      className="accessory"
      src={accessory.imgUrl}
      style={{
          position: 'absolute', 
          top: `${accessory.location[0]}%`, 
          left: `${accessory.location[1]}%`,
          transform: `scale(${accessory.scale}, ${accessory.scale})`
      }}
      >
      </img>
  )
}