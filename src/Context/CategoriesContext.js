import React, { createContext, useState, useEffect } from "react";

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState(() => {
        const storedCategories = localStorage.getItem('categories')
        return storedCategories ? JSON.parse(storedCategories) : [];
    })

    const [activeCategoryId, setActiveCategoryId] = useState(
        categories.length ? categories[0].id : null
    )

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories))
    }, [categories])

    return (
        <CategoriesContext.Provider value={{
            categories,
            setCategories,
            activeCategoryId,
            setActiveCategoryId
        }}>
            {children}
        </CategoriesContext.Provider>
    )
};
