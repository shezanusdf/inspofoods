'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch multiple random recipes
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/random.php'
        );
        const data = await response.json();
        setRecipes((prev) => [...prev, ...data.meals]);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    // Fetch initial recipes
    for (let i = 0; i < 10; i++) {
      fetchRecipes();
    }
  }, []);

  const handleSwipe = (direction: number) => {
    setDirection(direction);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handleSwipe(-1);
    if (e.key === 'ArrowRight') handleSwipe(1);
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touchStartX = e.touches[0].clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndX = e.touches[0].clientX;
      const swipeDirection = touchStartX - touchEndX;

      // If the swipe is significant, determine the direction
      if (Math.abs(swipeDirection) > 50) {
        handleSwipe(swipeDirection > 0 ? -1 : 1);
        window.removeEventListener('touchmove', handleTouchMove);
      }
    };

    window.addEventListener('touchmove', handleTouchMove);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const handleMakeNow = () => {
    const currentRecipe = recipes[currentIndex];
    router.push(`/recipe/${currentRecipe.idMeal}`); // Navigate to recipe details page
  };

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
            }}
            exit={{ 
              x: direction < 0 ? 300 : -300,
              opacity: 0,
              scale: 0.8,
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
                  <div class Name="text-gray-600">
                    Category: {recipes[currentIndex].strCategory}
                  </div>
                  <div className="text-gray-600">
                    Area: {recipes[currentIndex].strArea}
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleSwipe(-1)}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleMakeNow}
                    className="bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Make Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
