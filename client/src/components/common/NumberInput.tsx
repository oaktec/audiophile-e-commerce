import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { FC, useState } from "react";
import { AnimatedProgressIcon } from "../icons/Icons";

interface NumberInputProps {
  min: number;
  max: number;
  value: number;
  setValue: (val: number) => Promise<void>;
  className?: string;
}

const NumberInput: FC<NumberInputProps> = ({
  min,
  max,
  value,
  setValue,
  className,
}) => {
  const [buffering, setBuffering] = useState(false);

  return (
    <div
      className={cn(
        "relative  flex h-12 w-[7.5rem] items-center bg-gray-100",
        className,
      )}
    >
      <button
        className="absolute px-4 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
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
        <MinusIcon className="h-3 w-3" />
      </button>
      <span className="w-full bg-inherit text-center align-middle">
        {buffering ? (
          <AnimatedProgressIcon className="mx-auto text-accent" />
        ) : (
          value
        )}
      </span>
      <button
        className=" absolute right-0  px-4 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
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
        <PlusIcon className="h-3 w-3" />
      </button>
    </div>
  );
};

export default NumberInput;
