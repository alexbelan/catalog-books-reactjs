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

  function catalogId() {
    if(catalog.length == 0) {
      return 0
    } else {
      return catalog[0].id
    }
  }

  const id = useRef(catalogId())

  useEffect(() => {
    id.current++
    console.log(catalogId())
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
    setCatalog(prev => {
      return {
          ...prev,
          [key]: {
            id: catalog[key].id,
            img: catalog[key].img,
            title: catalog[key].title,
            author: catalog[key].author,
            about_book: catalog[key].about_book,
            edit: true,
          }
      }
    })
  }

  function editTitleBook(e, key) {
    setCatalog(prev => {
      return {
          ...prev,
          [key]: {
            id: catalog[key].id,
            img: catalog[key].img,
            title: e,
            author: catalog[key].author,
            about_book: catalog[key].about_book,
            edit: true,
          }
      }
    })
  }

  function editAuthorBook (e, key) {
    setCatalog(prev => {
      return {
          ...prev,
          [key]: {
            id: catalog[key].id,
            img: catalog[key].img,
            title: catalog[key].title,
            author: e,
            about_book: catalog[key].about_book,
            edit: true,
          }
      }
    })
  }
  
  function editAboutBook (e, key) {
    setCatalog(prev => {
      return {
          ...prev,
          [key]: {
            id: catalog[key].id,
            img: catalog[key].img,
            title: catalog[key].title,
            author: catalog[key].author,
            about_book: e,
            edit: true,
          }
      }
    })
  }

  function deleteBook(key) {
    setCatalog(() => {
      id.current--
      let newCatalogBooks = catalog.filter(item => item.id !== key)
      localStorage.setItem("books", JSON.stringify(newCatalogBooks));
      return newCatalogBooks
    })

    console.log(catalog)
  }

  function addNewBook() {
    if (newBook.title === "") {
      return alert("Нет названия книги")
    }
    if (newBook.author === "") {
      return alert("Нет автора книги")
    }
    setCatalog(prev => {
      let newCatalogBooks = [
        {
          id: id.current,
          img: newBook.img,
          title: newBook.title,
          author: newBook.author,
          about_book: newBook.about_book,
          edit: false
        },
        ...prev
      ]
      clearForm()
      localStorage.setItem("books", JSON.stringify(newCatalogBooks));
      return newCatalogBooks
    })
  }

  function saveEditBook(key) {

    setCatalog(prev => {
      let newCatalogBooks = {
          ...prev,
          [key]: {
            id: catalog[key].id,
            img: catalog[key].img,
            title: catalog[key].title,
            author: catalog[key].author,
            about_book: catalog[key].about_book,
            edit: false,
          }
        }
        localStorage.setItem("books", JSON.stringify(newCatalogBooks));
        return newCatalogBooks
    })
  }

  function renderBooks() {
    let books = []
    for (const key in catalog) {
      books.push(
      <> 
        <div className="book">
          <div className="content">
            {catalog[key].edit === true ? 
              <>
                <h4><input type="text" id="title" className="input-title" onChange={e => editTitleBook(e.target.value, key)} value={catalog[key].title} /></h4>
                <p>Автор:  <input type="text" id="author" className="input-author" onChange={e => editAuthorBook(e.target.value, key)} value={catalog[key].author} /></p>
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
              {catalog[key].edit === true ? 
                <>
                  <textarea className="input-text" onChange={e => editAboutBook(e.target.value, key)} value={catalog[key].about_book} readonly></textarea>
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
              {catalog[key].edit === true ?
                <button className="edit" onClick={() => saveEditBook(key)}>Сохранить</button>
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
      <div className="catalog-books">{renderBooks()}</div>
    </div>
  );
}

export default App;
