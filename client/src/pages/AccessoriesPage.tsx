// There are two sections in general settings:
// Settings
// Archived Eggs
// Top level settings should be accessible in the Settings section. Archived eggs should be viewable in the Archived Eggs section.
// There should be a component that when clicked shows the Egg Library.


import React from 'react';
import Accessories from '../Components/Accessory'; 

function AccessoriesPage() {
  return (
    <div className="Accessories">
      <h1>Accessory Catalog</h1>
      <Accessories accessory={{
        id: 0,
        name: '',
        imageUrl: ''
      }}/>
    </div>
  );
}

export default AccessoriesPage;
