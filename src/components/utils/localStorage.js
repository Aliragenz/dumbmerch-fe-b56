// utils/localStorage.js

export const saveCategoriesToLocalStorage = (categories) => {
    localStorage.setItem('categories', JSON.stringify(categories));
};

export const getCategoriesFromLocalStorage = () => {
    const categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : [];
};

export const addCategoryToLocalStorage = (newCategory) => {
    const categories = getCategoriesFromLocalStorage();
    categories.push(newCategory);
    saveCategoriesToLocalStorage(categories);
};

export const saveProductsToLocalStorage = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
};

export const getProductsFromLocalStorage = () => {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
};

export const addProductToLocalStorage = (newProduct) => {
    const products = getProductsFromLocalStorage();
    products.push(newProduct);
    saveProductsToLocalStorage(products);
};
