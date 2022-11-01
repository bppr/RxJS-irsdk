import React from 'react';
import { createRoot } from 'react-dom/client';

import { createGateway } from './Gateway';
import { App } from './components/App';

const PORT = 3001;

function main() {
  const container = document.getElementById('app');
  const root = createRoot(container!);
  const gateway = createGateway(PORT);
  
  root.render(<App gateway={gateway} />);
}

main()