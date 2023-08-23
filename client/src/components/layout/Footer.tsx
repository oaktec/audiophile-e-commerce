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
      <div className="container flex flex-col items-center justify-between gap-12 px-6 sm:items-start sm:px-10">
        <div className="h-[5px] w-[100px] bg-accent sm:mb-6" />
        <div className="flex w-full flex-col items-center gap-12 sm:items-start md:flex-row md:justify-between">
          <Link href="/">
            <MainLogo />
          </Link>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href={`/`} variant="footer">
              Home
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                href={`/category/${category}`}
                variant="footer"
                key={category}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-8 grid w-full grid-cols-1 justify-items-center gap-12 sm:grid-cols-2 sm:justify-items-start md:grid-flow-col md:grid-cols-1">
          <TypographyParagraph className="max-w-prose text-center text-white sm:col-span-2 sm:text-left md:col-span-1">
            Audiophile is an all in one stop to fulfil your audio needs. We're a
            small team of music lovers and sound specialists who are devoted to
            helping you get the most out of personal audio. Come and visit our
            demo facility - we&apos;re open 7 days a week.
          </TypographyParagraph>
          <TypographyParagraph className="max-w-prose text-center text-white">
            Copyright 2023. All Rights Reserved
          </TypographyParagraph>
          <div className="flex items-center gap-4 sm:ml-auto md:row-span-2">
            <Link href="#">
              <FacebookIcon />
            </Link>
            <Link href="#">
              <TwitterIcon />
            </Link>
            <Link href="#">
              <InstagramIcon />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
