import { CATEGORIES } from "@/config/config";
import { FC } from "react";
import { Link } from "../common/Link";
import { TypographyParagraph } from "../common/Typography";
import {
  FacebookIcon,
  InstagramIcon,
  MainLogo,
  TwitterIcon,
} from "../icons/Icons";

const Footer: FC = () => {
  return (
    <footer className="w-full bg-dark-background">
      <div className="container flex flex-col items-center justify-between gap-12 px-6 sm:px-10">
        <div className="h-[5px] w-[100px] bg-accent" />
        <Link href="/audiophile-e-commerce/">
          <MainLogo />
        </Link>
        <div className="flex flex-col items-center gap-4">
          <Link href={`/audiophile-e-commerce/`} variant="footer">
            Home
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              href={`/audiophile-e-commerce/category/${category}`}
              variant="footer"
              key={category}
            >
              {category}
            </Link>
          ))}
        </div>
        <TypographyParagraph className="max-w-prose text-center text-white">
          Audiophile is an all in one stop to fulfil your audio needs. We're a
          small team of music lovers and sound specialists who are devoted to
          helping you get the most out of personal audio. Come and visit our
          demo facility - we&apos;re open 7 days a week.
        </TypographyParagraph>
        <TypographyParagraph className="max-w-prose text-center text-white">
          Copyright 2023. All Rights Reserved
        </TypographyParagraph>
        <div className="mb-8 flex items-center gap-4">
          <FacebookIcon />
          <TwitterIcon />
          <InstagramIcon />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
