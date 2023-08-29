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
  type?: "radio";
  radioInputs?: string[];
}

const FormInput: FC<FormInputProps<FieldValues>> = ({
  formControl,
  label,
  name,
  type,
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
            type === "radio"
              ? "grid grid-cols-1 gap-2 sm:grid-cols-2 sm:space-y-0"
              : ""
          }
        >
          <FormLabel>
            {label ?? name.charAt(0).toUpperCase() + name.slice(1)}
          </FormLabel>
          <FormControl>
            {type === "radio" ? (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col gap-4"
              >
                {props.radioInputs?.map((input) => (
                  <FormItem
                    key={input}
                    className={cn(
                      "flex h-[3.5rem] items-center space-x-3 space-y-0 rounded-xl border p-4",
                      field.value === input ? "border-accent" : "",
                    )}
                  >
                    <FormControl>
                      <RadioGroupItem value={input} />
                    </FormControl>
                    <FormLabel className="text-sm">{input}</FormLabel>
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
