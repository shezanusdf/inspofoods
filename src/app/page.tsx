// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch multiple recipes by first letter 'a'
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?f=a'
        );
        const data = await response.json();
        setRecipes(data.meals || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSwipe = (direction: number) => {
    setDirection(direction);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handleSwipe(-1);
    if (e.key === 'ArrowRight') handleSwipe(1);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (recipes.length === 0) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md h-[600px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ 
              x: direction > 0 ? 300 : -300,
              opacity: 0,
              scale: 0.8
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0
            }}
            exit={{ 
              x: direction < 0 ? 300 : -300,
              opacity: 0,
              scale: 0.8,
              rotateY: direction < 0 ? -40 : 40
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="absolute w-full"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <img
                src={recipes[currentIndex].strMealThumb}
                alt={recipes[currentIndex].strMeal}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {recipes[currentIndex].strMeal}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Category:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {recipes[currentIndex].strCategory}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Cuisine:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      {recipes[currentIndex].strArea}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-between gap-4">
                <button
                  onClick={() => handleSwipe(-1)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSwipe(1)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 text-white text-center">
        <p className="text-sm">
          Use arrow keys or buttons to navigate
        </p>
        <p className="text-xs mt-2">
          Recipe {currentIndex + 1} of {recipes.length}
        </p>
      </div>
    </main>
  );
}