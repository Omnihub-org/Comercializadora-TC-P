import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as z from "zod";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";

export default function AutoFormRadio({
 label,
 isRequired,
 field,
 fieldConfigItem,
 zodItem,
 fieldProps,
}: AutoFormInputComponentProps) {
 const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
   .values;

 let values: [string, string][] = [];
 if (!Array.isArray(baseValues)) {
   values = Object.entries(baseValues);
 } else {
   values = baseValues.map((value) => [value, value]);
 }

 return (
   <FormItem>
     <AutoFormLabel
       label={fieldConfigItem?.label || label}
       isRequired={isRequired}
     />
     <FormControl>
       <RadioGroup
         onValueChange={field.onChange}
         defaultValue={field.value}
         {...fieldProps}
         className="flex gap-4"
       >
         {values.map(([value, label]) => (
           <div key={value} className="flex items-center space-x-2">
             <RadioGroupItem value={value} id={value} />
             <label htmlFor={value} className="text-sm font-medium">
               {label}
             </label>
           </div>
         ))}
       </RadioGroup>
     </FormControl>
     <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
     <FormMessage />
   </FormItem>
 );
}
