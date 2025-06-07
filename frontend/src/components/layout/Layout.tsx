import {Toaster} from "sonner";
import Header from "@/components/layout/Header.tsx";
import Footer from "@/components/layout/Footer.tsx";



type Props = {
    children: React.ReactNode,
}
const Layout = ({children}:Props) => {
    return (
        <div>
            <Toaster richColors position={'top-center'}/>
            <div className={'flex flex-col min-h-screen'}>
                <Header/>
                <div className={'container flex-1 px-0 max-w-[1600px]'}>
                    {children}
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default Layout;