import React from 'react';
import Link from 'next/link';
import { Dish } from '@/lib/dishData';

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
  buttonHref = '/food-map',
}) => {
  return (
    <>
      <h1 className={headingClassName}>{dish.name}</h1>
      <h3 className={taglineClassName}>{dish.tagline}</h3>
      <p className={descriptionClassName}>{dish.description}</p>

      {showButton && (
        <Link href={buttonHref} className={buttonClassName}>
          {buttonText}
        </Link>
      )}
    </>
  );
};

export default DishContent;
