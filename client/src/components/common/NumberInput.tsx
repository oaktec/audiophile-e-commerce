import { FC } from "react";

interface NumberInputProps {
  min: number;
  max: number;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const NumberInput: FC<NumberInputProps> = ({ min, max, value, setValue }) => {
  return (
    <div className="relative  flex h-12 w-[7.5rem] items-center bg-gray-100 align-middle">
      <button
        className="absolute px-4 py-3 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
        onClick={() => {
          if (value > min) {
            setValue(Math.min(value - 1, max));
          }
        }}
        disabled={value <= min}
      >
        -
      </button>
      <input
        type="number"
        className="w-full bg-inherit text-center"
        value={value}
        max={max}
        min={min}
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
      />
      <button
        className="absolute right-0 px-4 py-3 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
        onClick={() => {
          if (value < max) setValue(Math.max(min, value + 1));
        }}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default NumberInput;
