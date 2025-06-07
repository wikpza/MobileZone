import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";

type Props = {
    amount:number,
    isLoading:boolean,
    isError:boolean
}
const CurrentBalance = ({amount, isError, isLoading}:Props) => {

    if(isLoading) return(<div>...Loading</div>)
    if(isError) return(<div>Error:unable to get budget</div>)
    return (
        <Card className={' shadow-box '}>
            <CardHeader>
                <CardTitle>Current Balance</CardTitle>
                <CardDescription>Your available budget</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">
                    ${amount.toFixed(2)}
                </p>
            </CardContent>
        </Card>
    );
};

export default CurrentBalance;