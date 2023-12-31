import { cn } from "@/lib/utils";
import { FC } from "react";
import { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface FormInputProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: any;
  label?: string;
  name: keyof T;
  radio?: boolean;
  radioInputs?: string[];
}

const FormInput: FC<FormInputProps<FieldValues>> = ({
  formControl,
  label,
  name,
  radio = false,
  ...props
}) => {
  if (!formControl) throw new Error("formControl is required");

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem
          className={
            radio ? "grid grid-cols-1 gap-2 sm:grid-cols-2 sm:space-y-0" : ""
          }
        >
          <FormLabel>
            {label ?? name.charAt(0).toUpperCase() + name.slice(1)}
          </FormLabel>
          <FormControl>
            {radio ? (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col gap-4"
              >
                {props.radioInputs?.map((input) => (
                  <FormItem
                    key={input}
                    className={cn(
                      "relative flex h-[3.5rem] items-center space-x-0 space-y-0 rounded-xl border p-0",
                      field.value === input
                        ? "border-accent"
                        : "hover:border-accent-hover",
                    )}
                  >
                    <FormControl>
                      <RadioGroupItem value={input} />
                    </FormControl>
                    <FormLabel className="h-full w-full py-4 pl-10 text-sm">
                      {input}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            ) : (
              <Input {...props} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
