import React, {useState} from 'react';
import RenderBooks from './components/RenderBooks';
import Context from './api/context';
import localStorageApi from './api/localStorageApi';
import AddBook from './components/AddBook';

function App() {

  const [catalog, setCatalog] = useState(() => {
    let catalogBooks = localStorageApi.getCatalogBooks()
    if (catalogBooks !== null) {
      return catalogBooks
    } else {
      return []
    }
  });

  return (
    <Context.Provider value={[catalog, setCatalog]}>
        <AddBook/>
        <RenderBooks/> 
    </Context.Provider>
  );
} 

export default App;
