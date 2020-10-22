import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

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
        about_book: ""
      }
    })
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
          img: newBook.img,
          title: newBook.title,
          author: newBook.author,
          about_book: newBook.about_book,
        },
        ...prev
      ]
      clearForm()
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
            <h4>{catalog[key].title}</h4>
            <p>Автор: {catalog[key].author}</p>
            {catalog[key].img !== "" ? 
              <img className="img" src={catalog[key].img} /> : 
              <div className="img not-img">{catalog[key].title}</div>
            } 
          </div>
          <div className="about-book">
            <p>О книге:</p>
            {catalog[key].about_book !== "" ? 
              <p className="text">{catalog[key].about_book}</p> : 
              <p className="text">Нет описания</p> 
            } 
          </div>
        </div>
      </>)
    }
    return books;
  }

  function renderImg() {
    if (newBook.img === "") {
      return (<>
        <div className="img not-preview">Обложка</div>
      </>)
    } else {
      return (<>
        <img className="img" src={newBook.img} />
      </>)
    }
  }

  return (
    <div>
      <header>
        <div className="newBook">
          <div className="add-img">
            {renderImg()}
            <label for="img">Обложка</label>
            <input type="file" name="img" id="img" onChange={(e) => getImage(e)} />
          </div>
          <div className="about-book">
            <label for="about-book">О книге:</label>
            <textarea id="about-book" className="input-author" onChange={e => getAboutBook(e.target.value)} value={newBook.about_book} readonly></textarea>
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
