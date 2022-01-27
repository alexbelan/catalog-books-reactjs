import React, {useContext, useState} from "react";
import Context from "../api/context";
import localStorageApi from "../api/localStorageApi";

export default function RenderBooks() {
    const [catalog, setCatalog] = useContext(Context)
        
    const [editBook, setEditBook] = useState({
        key: null,
        title: "",
        author: "",
        about_book: ""
    })


    const btnEditBook = (key) => {
        setEditBook(() => {
            return {
                key: key,
                title: catalog[key].title,
                author: catalog[key].author,
                about_book: catalog[key].about_book,
            }
        })
    }
        
    const editBookForm = (e) => {
        e.persist()
        setEditBook(prev => {
            return {
              ...prev,
              [e.target.name]: e.target.value,
            }
        })
    }     
        
    const deleteBook = (key) => {
        setCatalog(() => {
            let newCatalogBooks = Object.values(catalog).filter(item => item.id !== key)
            localStorage.setItem("books", JSON.stringify(newCatalogBooks));
            return newCatalogBooks
        })
    }

    const saveEditBook = () => {
        let key = editBook.key
        if (!editBook.title || !editBook.author) {
            return alert("Нет названия или автора книги")
        } else {
            setCatalog(() => {
                let newCatalogBooks = catalog
                let newChangeBook = {
                    id: catalog[key].id,
                    img: catalog[key].img,
                    title: editBook.title,
                    author: editBook.author,
                    about_book: editBook.about_book,
                }
                newCatalogBooks[key] = newChangeBook
                localStorageApi.changeCatalogBooks(newCatalogBooks)
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

    const renderBooks = () => {
        const books = []
        books.push(catalog.map((book, index) => {
            return (
            <div className="book" key={book.id}>
                <div className="content">
                    {editBook.key !== null && editBook.key === index ?
                        <>
                            <h4><input name="title" type="text" id="title" className="input-title input-edit" onChange={editBookForm} value={editBook.title} /></h4>
                            <p>Автор:</p>
                            <input id="author" type="text" name="author" className="input-author input-edit" onChange={editBookForm} value={editBook.author} />
                        </>
                        :
                        <>
                            <h4>{book.title}</h4>
                            <p>Автор:</p>
                            <p class="author-book">{book.author}</p>
                        </>}
                        {book.img !== "" ? 
                            <img className="img" src={book.img} alt=""/> 
                            : 
                            <div className="img not-img">{book.title}</div>
                        } 
                </div>
                <div className="about-book">
                    <p>О книге:</p>
                    <div className="about-book-text">
                        {editBook.key !== null && editBook.key === index ?
                            <textarea className="input-text input-edit" name="about_book" onChange={editBookForm} value={editBook.about_book}></textarea>
                            :
                            <>
                                {book.about_book !== "" ?
                                    <p className="text">{book.about_book}</p> :
                                    <p className="text">Нет описания</p>}
                            </>
                        }

                    </div>
                    <div className="btns">
                        {editBook.key !== null && editBook.key === index ?
                            <button className="edit" onClick={saveEditBook}>Сохранить</button>
                            :
                            <>
                                <button className="edit" onClick={() => btnEditBook(index)}>Редактировать</button>
                                <button className="delete" onClick={() => deleteBook(book.id)}>Удалить</button>
                            </>}
                    </div>
                </div>
            </div>);
        }))

        return (
            <main className="catalog-books">
                {books}
            </main>
        );
    }

    return renderBooks()
}