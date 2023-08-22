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

interface FormInputProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: any;
  label?: string;
  name: keyof T;
}

const FormInput: FC<FormInputProps<FieldValues>> = ({
  formControl,
  label,
  name,
  ...props
}) => {
  if (!formControl) throw new Error("formControl is required");

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label ?? name.charAt(0).toUpperCase() + name.slice(1)}
          </FormLabel>
          <FormControl>
            <Input {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
