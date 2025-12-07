import { useState, useEffect } from "react";
import { Recipe, recipes as initialRecipes } from "@/data/recipes";

const STORAGE_KEY = "dijabeto_recipes";

export const useRecipeStorage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecipes(JSON.parse(stored));
    } else {
      setRecipes(initialRecipes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecipes));
    }
  }, []);

  const updateRecipe = (updatedRecipe: Recipe) => {
    const newRecipes = recipes.map((r) =>
      r.id === updatedRecipe.id ? updatedRecipe : r
    );
    setRecipes(newRecipes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
  };

  const getRecipeById = (id: number): Recipe | undefined => {
    return recipes.find((r) => r.id === id);
  };

  return { recipes, updateRecipe, getRecipeById };
};

export const getStoredRecipes = (): Recipe[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return initialRecipes;
};

export const updateStoredRecipe = (updatedRecipe: Recipe) => {
  const recipes = getStoredRecipes();
  const newRecipes = recipes.map((r) =>
    r.id === updatedRecipe.id ? updatedRecipe : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
  return newRecipes;
};