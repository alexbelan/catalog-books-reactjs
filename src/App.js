import React, {useState, useRef, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import RenderImg from './components/RenderImg'

function App() {

  const [catalog, setCatalog] = useState(() => {
    let catalogBooks = JSON.parse(localStorage.getItem("books"))
    if (catalogBooks !== null) {
      return catalogBooks
    } else {
      return []
    }
  });

  const [newBook, setNewBook] = useState({
    img: "",
    title: "",
    author: "",
    about_book: ""
  })

  const [editBook, setEditBook] = useState({
    key: null,
    title: "",
    author: "",
    about_book: ""
  })

  function catalogId() {
    let id = localStorage.getItem("id-book")
    if(id !== null) {
      return id
    } else {
      return 0
    }
  }

  const id = useRef(catalogId())

  useEffect(() => {
    id.current++
  }, [catalog])


  function getTitle(e) {
    setNewBook(prev => {
      return {
        ...prev,
        title: e
      }
    })
  }

  function getText(e) {
    setNewBook(prev => {
      return {
        ...prev,
        author: e
      }
    })
  }

  function getImage(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setNewBook(prev => {
        return {
          ...prev,
          file: file,
          img: reader.result
        }
      })
    }
    reader.readAsDataURL(file)
  }

  function getAboutBook(e) {
    setNewBook(prev => {
      return {
        ...prev,
        about_book: e
      }
    })
  }

  function clearForm() {
    setNewBook(() => {
      return {
        img: "",
        title: "",
        author: "",
        about_book: "",
      }
    })
  }

  function btnEditBook(key) {
    setEditBook(() => {
      return {
          key: key,
          title: catalog[key].title,
          author: catalog[key].author,
          about_book: catalog[key].about_book,
        }
    })
  }

  function editTitleBook(e) {
    setEditBook(prev => {
      return {
          ...prev,
          title: e,
        }
    })
  }

  function editAuthorBook (e) {
    setEditBook(prev => {
      return {
        ...prev,
        author: e,
      }
    })
  }
  
  function editAboutBook (e) {
    setEditBook(prev => {
      return {
            ...prev,
            about_book: e,
          }
      })
  }

  function deleteBook(key) {
    id.current--
    setCatalog(() => {
      let newCatalogBooks = Object.values(catalog).filter(item => item.id !== key)
      localStorage.setItem("books", JSON.stringify(newCatalogBooks));
      return newCatalogBooks
    })
  }

  function addNewBook() {
    if (newBook.title === "") {
      return alert("Нет названия книги")
    }
    if (newBook.author === "") {
      return alert("Нет автора книги")
    }
    setCatalog( () => {
      let newCatalogBooks = Object.values(catalog)
      newCatalogBooks.unshift({
        id: id.current,
        img: newBook.img,
        title: newBook.title,
        author: newBook.author,
        about_book: newBook.about_book,
      })
      clearForm()
      localStorage.setItem("books", JSON.stringify(newCatalogBooks));
      localStorage.setItem("id-book", JSON.stringify(id.current));
      return newCatalogBooks
    })
  }

  function saveEditBook() {
    let key = editBook.key
    if (editBook.title === "" || editBook.author === "") {
      return alert("Нет названия или автора книги")
    } else {
      id.current--;
      setCatalog(prev => {
        let newCatalogBooks = {
            ...prev,
            [key]: {
              id: catalog[key].id,
              img: catalog[key].img,
              title: editBook.title,
              author: editBook.author,
              about_book: editBook.about_book,
            }
          }
          localStorage.setItem("books", JSON.stringify(newCatalogBooks));
          return newCatalogBooks
      })
      setEditBook(() => {
        return {
          key: null,
          title: "",
          author: "",
          about_book: ""
        }
      })
    }
  }

  function renderBooks() {
    let books = []
    for (const key in catalog) {
      books.push(
      <> 
        <div className="book">
          <div className="content">
            {editBook.key !== null && editBook.key === key ? 
              <>
                <h4><input type="text" id="title" className="input-title" onChange={e => editTitleBook(e.target.value)} value={editBook.title} /></h4>
                <p>Автор:  <input type="text" id="author" className="input-author" onChange={e => editAuthorBook(e.target.value)} value={editBook.author} /></p>
              </> : 
              <>
                <h4>{catalog[key].title}</h4>
                <p>Автор: {catalog[key].author}</p>
              </>
            } 
            
            {catalog[key].img !== "" ? 
              <img className="img" src={catalog[key].img} /> : 
              <div className="img not-img">{catalog[key].title}</div>
            } 
          </div>
          <div className="about-book">
            <p>О книге:</p>
            <div className="about-book-text">
              {editBook.key !== null && editBook.key === key ? 
                <>
                  <textarea className="input-text" onChange={e => editAboutBook(e.target.value)} value={editBook.about_book} readonly></textarea>
                </> : 
                <>
                  {catalog[key].about_book !== "" ? 
                    <p className="text">{catalog[key].about_book}</p> : 
                    <p className="text">Нет описания</p> 
                  } 
                </>
              } 
              
            </div>
            <div className="btns">
              {editBook.key !== null && editBook.key === key ?
                <button className="edit" onClick={() => saveEditBook()}>Сохранить</button>
                :
                <>
                  <button className="edit" onClick={() => btnEditBook(key)}>Редактировать</button>
                  <button className="delete" onClick={() => deleteBook(catalog[key].id)}>Удалить</button>
                </>
              }
            </div>
          </div>
        </div>
      </>)
    }
    return books;
  }

  return (
    <div>
      <header>
        <div className="newBook">
          <div className="add-img">
            <RenderImg img={newBook.img} title={newBook.title} />
            <label for="img">Обложка</label>
            <input type="file" name="img" id="img" onChange={(e) => getImage(e)} />
          </div>
          <div className="about-book">
            <label for="about-book">О книге:</label>
            <textarea id="about-book" className="input-text" onChange={e => getAboutBook(e.target.value)} value={newBook.about_book} readonly></textarea>
          </div>
          <div className="form">
            <label for="title">Название книги:</label> 
            <input type="text" id="title" className="input-title" onChange={e => getTitle(e.target.value)} value={newBook.title} />
            <label for="author">Автор книги:</label>
            <input type="text" id="author" className="input-author" onChange={e => getText(e.target.value)} value={newBook.author} />
            <button className="btn" onClick={addNewBook}>Добавить книгу</button>
          </div>
        </div>
      </header>
    <div className="catalog-books"> {renderBooks()} </div>
    </div>
  );
} 

export default App;
