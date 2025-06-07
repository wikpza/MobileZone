import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "./form.tsx";
import {Input} from "./input.tsx";
import {UseFormReturn} from "react-hook-form";
import React, {useState} from "react";
import {CreateEmployeeType, UpdateEmployeeType} from "@/types/employee.ts";


type Props = {
    form: UseFormReturn<CreateEmployeeType>;
};

const PhoneNumberInput: React.FC<Props> = ({  form }) => {
    const handlerPhoneNumberSubmit=(value)=> {
        const mask = "+996(___)__-__-__" // Новая маска

        if (value.length === 1 && /^\d+$/.test(value.slice(0))) {
            form.setValue('phone', mask.replace("_", value), {shouldValidate: true})
            return
        }

        // Изменяем длину проверки на 18
        if(value.length === 18 && /^\d+$/.test(value.slice(-1))){
            form.setValue('phone', value.replace("_",  value.slice(-1)).slice(0, -1), {shouldValidate: true})
            return
        }

        if( value.length === 1 && !/^\d+$/.test(value.slice(0)) ){
            return
        }

        // Изменяем длину проверки на 18
        if( value.length === 18 && !/^\d+$/.test(value.slice(-1)) ){
            return
        }

        let numberArray = value.split('').slice(4,).filter((number)=>/^\d+$/.test(number))
        if(numberArray.length === 0){
            return
        }else if(numberArray.length < 9){
            numberArray = numberArray.slice(0,-1)
        }
        const  newNumber = mask.replace(/_/g, () => numberArray.length ? numberArray.shift() : "_");
        form.setValue('phone', newNumber, {shouldValidate: true})
    }

    return (
        <FormField name={"phone"} control={form.control} render={({field}) =>
            <FormItem className={'flex-1 text-left relative space-y-0 font-sans'}>
                <FormLabel> Phone number</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        onChange={(e) => handlerPhoneNumberSubmit(e.target.value)}

                    />
                </FormControl>
                <FormMessage/>
            </FormItem>
        }/>
    );
};

export default PhoneNumberInput;