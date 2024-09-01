import React, { useState } from 'react';
import HeroSection from './HeroSection';
import QueryAi from '../utils/QueryAi';

const App = () => {
  const [searchPrompt, setSearchPrompt] = useState('');

  const handleSearchSubmit = (input) => {
    setSearchPrompt(input);
  };

  return (
    <div className="App">
      <HeroSection onSearch={handleSearchSubmit} />
      <QueryAi prompt={searchPrompt} />
    </div>
  );
};

export default App;
