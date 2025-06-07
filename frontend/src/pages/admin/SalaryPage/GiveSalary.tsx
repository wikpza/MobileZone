import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogClose,
    DialogContent,
     DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import { GetSalaryList} from "@/types/salary.ts";
import {Check} from "lucide-react";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {useGiveSalary} from "@/api/salary.api.ts";
import {FormErrors, isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";


type Props = {
    year:number,
    month:number,
    isGive:boolean,
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     data?: GetSalaryList[]
        response?: FormErrors | {         message: string     }
        status: number }, unknown>>
}

const UpdateSalaryStatusDialog = ({year, month, refetch, isGive}:Props) => {
    const {update, isSuccess, response} = useGiveSalary()


    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            toast.error(response.response.message);
        }
    }, [response]);

    useEffect(() => {
        if (isSuccess && response?.status >= 200 && response?.status < 300) {
            refetch()
            setIsDialogOpen(false)

        }
    }, [isSuccess]);


    const handleSubmit = () => {
        update({month:month, year:year})
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger disabled={!isGive}>
                <Button
                    size="sm"
                    variant={isGive ? "default" : "outline"}
                    className="h-8 px-2 flex gap-1"
                    disabled={!isGive}
                >
                    <Check className="h-4 w-4"/>
                    Paid Salary Every Employee
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <p className="text-gray-600 text-sm">
                    Once the salary is paid, it cannot be reverted or changed.
                </p>
                <DialogFooter className=" mt-5 sm:justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button onClick={handleSubmit}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateSalaryStatusDialog;