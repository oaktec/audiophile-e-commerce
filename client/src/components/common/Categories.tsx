import ArrowRightIcon from "@/assets/shared/desktop/icon-arrow-right.svg";
import { CATEGORIES } from "@/config/config";
import React, { useEffect, useState } from "react";

interface Props {
  type?: "home" | "menu";
}

const Categories: React.FC<Props> = ({ type = "home" }) => {
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
      <div
        className={`${
          type === "home" ? "mt-[5.75rem]" : "mt-10"
        } flex flex-col gap-[4.25rem] md:flex-row md:gap-2`}
      >
        {CATEGORIES.map((category) => (
          <a
            href={`/category/${category}`}
            className={`relative flex ${
              type === "home" ? "h-40" : "h-28"
            } cursor-pointer flex-col items-center justify-end gap-4 rounded-lg bg-gray-100 pb-4 text-black duration-300 hover:text-accent md:mx-0 md:flex-1`}
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
