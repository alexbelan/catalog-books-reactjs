import React, {useState, useContext} from "react"
import uuid from 'react-uuid'
import Context from "../api/context"
import localStorageApi from "../api/localStorageApi"

export default function AddBook() {

    const [catalog, setCatalog] = useContext(Context)

    const [newBook, setNewBook] = useState({
        img: "",
        title: "",
        author: "",
        about_book: ""
    })
    
    const newBookForm = (e) => {
        e.persist()
        setNewBook(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        })
    }
    
    const getImage = (e) => {
    
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
    
    const clearForm = () => {
        setNewBook(() => {
            return {
                img: "",
                title: "",
                author: "",
                about_book: "",
            }
        })
    }
    
    const addNewBook = () => {
        if (!newBook.title) {
            return alert("Нет названия книги")
        }
        if (!newBook.author) {
            return alert("Нет автора книги")
        }
        setCatalog( () => {
            let newCatalogBooks = Object.values(catalog)
            newCatalogBooks.unshift({
                id: uuid(),
                img: newBook.img,
                title: newBook.title,
                author: newBook.author,
                about_book: newBook.about_book,
            })
            clearForm()
            localStorageApi.changeCatalogBooks(newCatalogBooks)
            return newCatalogBooks
        })
    }


    return (
        <header>
            <div className="newBook">
                <div className="add-img">
                    {newBook.img !== "" ? 
                        <img className="img" src={newBook.img} alt=""/> 
                        : 
                        <div className="img not-preview">{newBook.title}</div>
                    }
                    <label for="img">Обложка</label>
                    <input type="file" name="img" id="img" onChange={(e) => getImage(e)} />
                </div>
                <div className="about-book">
                    <label for="about-book">О книге:</label>
                    <textarea id="about-book" name="about_book" className="input-text" onChange={newBookForm} value={newBook.about_book} readonly></textarea>
                </div>
                <div className="form">
                    <label for="title">Название книги:</label> 
                    <input type="text" name="title" id="title" className="input-title" onChange={newBookForm} value={newBook.title} />
                    <label for="author">Автор книги:</label>
                    <input type="text" name="author" id="author" className="input-author" onChange={newBookForm} value={newBook.author} />
                    <button className="btn" onClick={addNewBook}>Добавить книгу</button>
                </div>
            </div>
        </header>
    )
}