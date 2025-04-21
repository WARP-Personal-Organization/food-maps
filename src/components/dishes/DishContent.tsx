import React from 'react';
import Link from 'next/link';
import { Dish } from '@/lib/dishData';
import { useSearchParams } from 'next/navigation';

interface DishContentProps {
  dish: Dish;
  headingClassName?: string;
  taglineClassName?: string;
  descriptionClassName?: string;
  buttonClassName?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonHref?: string;
}

const DishContent: React.FC<DishContentProps> = ({
  dish,
  headingClassName = 'text-4xl font-bold mt-2',
  taglineClassName = 'italic text-gray-500 text-lg',
  descriptionClassName = 'text-gray-700 mt-4',
  buttonClassName = 'mt-6 w-[345px] bg-[#F9D408] text-black font-bold py-3 rounded inline-block text-center cursor-pointer',
  showButton = true,
  buttonText = 'Where to Eat',
  buttonHref,
}) => {
  // Use provided buttonHref or use the href from the dish data
  const href = buttonHref || dish.href;
  const searchParams = useSearchParams();

  // Add query parameter for dish name if linking to food-map
  let linkHref = href;

  if (href === '/food-map') {
    // If we're linking to the food-map page
    const currentDishParam = searchParams.get('dish');

    if (currentDishParam && currentDishParam.includes(',')) {
      // If there are already multiple dishes in the URL
      const currentDishes = currentDishParam.split(',');

      // Only add this dish if it's not already included
      if (!currentDishes.includes(dish.name)) {
        linkHref = `${href}?dish=${currentDishParam},${encodeURIComponent(
          dish.name
        )}`;
      } else {
        linkHref = `${href}?dish=${currentDishParam}`;
      }
    } else if (currentDishParam && currentDishParam !== dish.name) {
      // If there's one dish that's different from this one, add this dish to it
      linkHref = `${href}?dish=${currentDishParam},${encodeURIComponent(
        dish.name
      )}`;
    } else {
      // If there's no current dish or it's the same as this one
      linkHref = `${href}?dish=${encodeURIComponent(dish.name)}`;
    }
  }

  return (
    <>
      <h1 className={headingClassName}>{dish.name}</h1>
      <h3 className={taglineClassName}>{dish.tagline}</h3>
      <p className={descriptionClassName}>{dish.description}</p>

      {showButton && (
        <Link href={linkHref} className={buttonClassName}>
          {buttonText}
        </Link>
      )}
    </>
  );
};

export default DishContent;
