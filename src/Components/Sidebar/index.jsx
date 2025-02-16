import { useContext, useEffect, useState } from 'react'
import './index.scss'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { CategoriesContext } from '../../Context/CategoriesContext.js'

const AsideBar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 50px;
  background-color: #242424;
  color: white;
  max-width: 20%;
  width: 100%;
  height: 100vh;
  padding: 30px;
  border-right: 1px solid black;

    input {
      border-radius: 5px;
      padding: 5px 10px;
      width: 80%;
      border: 2px solid grey;
    }

    button {
      background-color: transparent;
      color: white;}
  `

const ListTitle = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0 0 25px 0;

    button {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: white;
    color: black;
    }

    div {
    display: flex;
    }
  `
const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 0 0;

    p {
    font-size: 16px;
    }

    div {
    display: flex;
    gap: 10px;
    }

    input {
    border-radius: 5px;
    padding: 5px 10px;
    width: 80%;
    border: 2px solid grey;
    }
`

const ListButtons = styled.button`
  background-color: transparent;
  color: white;
  `

const CategorieButtons = styled.button`
  background-color: transparent;
  color: white;
`

function Sidebar() { 
  const {categories, setCategories, setActiveCategoryId } = useContext(CategoriesContext)


  const [show, setShow] = useState(false)
  
  const [newCategorieName, setNewCategorieName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editedCategorie, setEditedCategorie] = useState('')

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  const addCategorie = () => {
    const trimmedName = newCategorieName.trim();
    if (trimmedName !== '') {
      const newCategorie = {
        id: categories.length + 1,
        name: trimmedName,
        tasks: []
      }
      setCategories([...categories, newCategorie])
      setNewCategorieName('')
      setShow(!show)
    }
  }

  const deleteCategorie = (id) => {
    const updatedCategories = categories.filter(categorie => categorie.id !== id)
    setCategories(updatedCategories)
  }

  const editCategorie = (id, name) => {
    setEditId(id)
    setEditedCategorie(name)
  } 

  const saveCategorie = (id) => {
    const updatedCategories = categories.map(categorie => categorie.id === id ? {...categorie, name: editedCategorie} : categorie)
    setCategories(updatedCategories)
    setEditId(null)
    setEditedCategorie('')
  }

  console.log(show)

  return (
    <AsideBar>
      <div>
        <h1>Jeudi</h1>
        <p>09/01/2025</p>
        <p>12:55</p>
      </div>
      <nav>
        <ListTitle>
          <h2>Mes listes</h2>
          <button onClick={() => setShow(!show)}> + </button>
        </ListTitle>
        <div className='addCatInput'>
          {show ?
          <>
            <input 
            type="text" 
            style={{width: '80%'}}
            placeholder='Ajouter' 
            value={newCategorieName}
            onChange={(e) => setNewCategorieName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategorie()}
            /> 
            <button onClick={addCategorie}>
              <FontAwesomeIcon icon={faSquareCheck} size="2xl" />
            </button>
          </> 
          : 
          <>
            {null} 
          </>
          }
        </div>
        <ul>
          {categories.map((categorie) => (
          <ListItem key={categorie.id}>
            {editId === categorie.id ? (
            <>
              <input 
                type="text"
                value={editedCategorie}
                onChange={(e) => setEditedCategorie(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveCategorie(categorie.id)}
              />
              <CategorieButtons onClick={() => saveCategorie(categorie.id)}>
                <FontAwesomeIcon icon={faSquareCheck} size="lg" />
              </CategorieButtons>
            </>
            ) : (
            <>
              <ListButtons
                onClick={() => setActiveCategoryId(categorie.id)}>
                  <p>
                    {categorie.name}
                  </p>
              </ListButtons>
              <div>
                <CategorieButtons onClick={() => editCategorie(categorie.id, categorie.name)}>
                  <FontAwesomeIcon icon={faEdit} /> 
                </CategorieButtons>
                <CategorieButtons onClick={() => deleteCategorie(categorie.id)}>
                  <FontAwesomeIcon icon={faTrash} /> 
                </CategorieButtons>
              </div>
            </>
            )}
          </ListItem>
          ))}
        </ul>
      </nav>
    </AsideBar>
  )
}

export default Sidebar