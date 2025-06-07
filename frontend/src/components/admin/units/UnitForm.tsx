import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {CreateUnitType} from "@/types/unit.ts";
import {FormErrors, isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {useEffect} from "react";
import {toast} from "sonner";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
});


type UnitFormProps = {
  onSubmit: (values: CreateUnitType) => void
  onCancel?: () => void,
    status: number | undefined,
    response: { message: string } | FormErrors | undefined,
}

export function UnitForm({ onSubmit, onCancel, response, status }: UnitFormProps) {

  const form = useForm<CreateUnitType>({
    resolver: zodResolver(formSchema),
    defaultValues:  {
      name: "",
    },
  })

    useEffect(() => {
        if (response && isFormErrors(response) && status && status >=400 && status < 500) {

            if ("name" in response.details) {
                console.log(response)
                form.setError("name", {
                    type: "manual",
                    message: response.details.name.join(","),
                });
            }else{
                toast.error(response.message)
            }


        }
    }, [response, status, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Kilogram" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save Unit</Button>
        </div>
      </form>
    </Form>
  )
}