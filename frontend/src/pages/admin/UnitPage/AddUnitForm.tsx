import {UnitForm} from "@/components/admin/units/UnitForm.tsx";
import {toast} from "sonner";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {GetUnit, Unit} from "@/types/unit.ts";
import {useCreateUnit} from "@/api/Unit.api.ts";
import {FormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {useEffect} from "react";


type Props = {
    setShowForm: (boolean) => void,
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{
        unit?: GetUnit[]
        status: number }, unknown>>
}
const AddUnitForm = ({ setShowForm, refetch}:Props) => {
    const {createUnit, error, isLoading, isSuccess, response} = useCreateUnit()

    useEffect(() => {
        if(isSuccess && response  && response?.status === 201) {
            refetch()
            setShowForm(false)
        }
    }, [isSuccess]);



    return (
        <div className="bg-card p-4 rounded-lg border shadow-box">
            <h2 className="text-lg font-semibold mb-4">
                {"Add New Unit"}
            </h2>
            <UnitForm
                onSubmit={ (newUnit)=>createUnit(newUnit)}
                onCancel={() => {
                    setShowForm(false)
                }}
                status={response?.status}
                response={response?.response}
            />
        </div>
    );
};

export default AddUnitForm;