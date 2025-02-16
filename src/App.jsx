import './App.css';
import { useState } from 'react';
import Sidebar from './Components/Sidebar'
import Tasklists from './Components/TasksLists'

function App() {

  const [categories, setCategories] = useState(() => {
      const storedCategories = localStorage.getItem('categories');
      return storedCategories ? JSON.parse(storedCategories) : [];
    });

  const [activeCategoryId, setActiveCategoryId] = useState(
    categories.length ? categories[0].id : null
  );

  console.log('App component is rendering');

  console.log(activeCategoryId)

  return (
    <div className='main'>
      <Sidebar
        categories={categories}
        setCategories={setCategories} 
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
      />
      <Tasklists 
        categories={categories}
        setCategories={setCategories}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
      />
    </div>
  )
}
export default App;
