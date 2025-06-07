import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form.tsx';
import { UseFormReturn } from 'react-hook-form';
import {CreateEmployeeType, UpdateEmployeeType} from "@/types/employee.ts";
import {Input} from "@/components/ui/input.tsx";

type Props = {
    name: "address" | "lastName" | "firstName" | "middleName";
    label: string;
    form: UseFormReturn<CreateEmployeeType>;
    type?: string;
};

const Layout: React.FC<Props> = ({ name, form, type, label }) => {

    return (
        <FormField name={name} control={form.control} render={({ field }) => (
            <FormItem >
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    );
};

export default Layout;
