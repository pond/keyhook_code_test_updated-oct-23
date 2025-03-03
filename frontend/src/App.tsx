import React from 'react';

import { Department, Employee } from './Models';
import { List                 } from './components/List';
import { ListItemEmployee     } from './components/ListItemEmployee';
import { ListHeaderEmployee   } from './components/ListHeaderEmployee';

const App: React.FC = () => {
  return (
    <List ListItem={ListItemEmployee} HeaderItem={ListHeaderEmployee} SpraypaintModel={Employee} />
  );
}

export default App
