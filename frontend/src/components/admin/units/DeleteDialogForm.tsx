import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Trash2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

type Props = {
    deleteFunction:()=>void
}
const DeleteDialogForm = ({deleteFunction}:Props) => {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Trash2 className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent className={'space-y-4'}>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure to delete data?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <div className={'flex gap-2'}>
                    <Button
                        variant={'secondary'}
                        onClick={()=>setOpen(false)}
                        className={'w-full rounded border-gray-600 border'}
                    >Cancel</Button>
                    <Button
                        variant={'destructive'}
                        className={'w-full rounded'}
                        onClick={()=>{
                            deleteFunction()
                            setOpen(false)
                        }}
                    >Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialogForm;