import { FC, useState } from "react";
import { AnimatedProgressIcon } from "../icons/Icons";

interface NumberInputProps {
  min: number;
  max: number;
  value: number;
  setValue: (val: number) => Promise<void>;
}

const NumberInput: FC<NumberInputProps> = ({ min, max, value, setValue }) => {
  const [buffering, setBuffering] = useState(false);

  return (
    <div className="relative  flex h-12 w-[7.5rem] items-center bg-gray-100 align-middle">
      <button
        className="absolute px-4 py-3 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
        onClick={() => {
          if (value > min) {
            setBuffering(true);
            setValue(Math.min(value - 1, max)).then(() => {
              setBuffering(false);
            });
          }
        }}
        disabled={value <= min || buffering}
      >
        -
      </button>
      <span className="w-full bg-inherit text-center">
        {buffering ? (
          <AnimatedProgressIcon className="mx-auto text-accent" />
        ) : (
          value
        )}
      </span>
      <button
        className="absolute right-0 px-4 py-3 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
        onClick={() => {
          if (value < max) {
            setBuffering(true);
            setValue(Math.max(min, value + 1)).then(() => {
              setBuffering(false);
            });
          }
        }}
        disabled={value >= max || buffering}
      >
        +
      </button>
    </div>
  );
};

export default NumberInput;
