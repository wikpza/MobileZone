import {ReactNode} from "react";
import {ClockLoader} from "react-spinners";


type Props = {
    children:ReactNode,
    isLoading:boolean,
    typeLoader?:ReactNode,
    className?:string
    size?:number
}
const LoadingOverlay = ({ className = "", isLoading = false, children, size }: Props) => {
    return (
        <div className={`${className} relative`}>
            {isLoading && (
                <div
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    className="w-full h-full absolute top-0 left-0 z-10"
                />
            )}
            {isLoading && (
                <ClockLoader
                    size={size || 50}
                    color={"#ffde21"}
                    className=" !absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 block"
                    loading={isLoading}
                />
            )}
            <div className={isLoading ? "opacity-50" : "opacity-100"}>
                {children}
            </div>
        </div>
    );
};


export default LoadingOverlay;