import ArrowRightIcon from "@/assets/shared/desktop/icon-arrow-right.svg";
import { CATEGORIES } from "@/config/config";
import React, { useEffect, useState } from "react";

const Categories: React.FC = () => {
  const [categoryImages, setCategoryImages] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const loadImages = async () => {
      const images: { [key: string]: string } = {};
      for (const category of CATEGORIES) {
        images[category] = (
          await import(
            `../../assets/shared/desktop/image-category-thumbnail-${category}.png`
          )
        ).default;
      }
      setCategoryImages(images);
    };

    loadImages();
  }, []);

  return (
    <div className="container px-6 sm:px-10">
      <div className="mt-[5.75rem] flex flex-col gap-[4.25rem] md:flex-row md:gap-2">
        {CATEGORIES.map((category) => (
          <a
            href={`/audiophile-e-commerce/category/${category}`}
            className="relative flex h-40 cursor-pointer flex-col items-center justify-end gap-4 rounded-lg bg-gray-100 pb-4 text-black duration-300 hover:text-accent md:mx-0 md:flex-1"
            key={category}
          >
            {categoryImages[category] && (
              <img
                className="absolute bottom-[40%] h-full"
                src={categoryImages[category]}
                alt={`${category} thumbnail`}
              />
            )}
            <span className="text-[0.9375rem] font-bold uppercase tracking-[0.06694rem] md:text-lg">
              {category}
            </span>
            <div className="flex items-center justify-center gap-4">
              <span className="text-[0.8125rem] font-bold uppercase leading-none opacity-50">
                shop{" "}
              </span>
              <img src={ArrowRightIcon} alt="arrow right" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Categories;
