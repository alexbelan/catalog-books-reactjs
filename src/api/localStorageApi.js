const localStorageApi = {
    getCatalogBooks: () => {
        return JSON.parse(localStorage.getItem("books"))
    },
    changeCatalogBooks: (catalog) => {
        localStorage.setItem("books", JSON.stringify(catalog));
    }
}

export default localStorageApi