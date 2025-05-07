import React from 'react';
import Image from 'next/image';
import { Dish } from '@/types/types';

interface DishImageProps {
  dish: Dish;
  className?: string;
  imageClassName?: string;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  priority?: boolean;
}

const DishImage: React.FC<DishImageProps> = ({
  dish,
  className = 'relative h-full w-full',
  imageClassName = '',
  onTouchStart,
  onTouchEnd,
  priority = false,
}) => {
  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        sizes="(max-width: 900px) 100vw, 50vw"
        quality={95}
        className={`object-cover ${imageClassName}`}
        priority={priority}
      />
    </div>
  );
};

export default DishImage;
