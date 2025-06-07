import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {GetPosition} from "@/types/position.ts";


type Props = {
    positions:GetPosition[] | undefined,
    setSelectedProduct:(value:GetPosition)=>void,
    selectedPosition:GetPosition
}

const SelectPosition = ({positions:data, setSelectedProduct, selectedPosition}:Props) => {
    if(!data) return (<div>unable to load data</div>)
    return (
        <div className="mb-6 max-w-xs">
            <Select
                value={selectedPosition?.id.toString() || ""}
                onValueChange={(value) => {
                    const findProduct = data.find((product) => product.id.toString() === value);
                    setSelectedProduct(findProduct);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                    {data.length === 0 && <div className={'p-3 cursor-pointer'}>Before selecting position, create a position </div>}
                    {data.map((position) => (
                        <SelectItem key={position.id} value={position.id.toString()}>
                            {position.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectPosition;