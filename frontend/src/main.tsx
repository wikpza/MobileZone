import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {QueryClient, QueryClientProvider} from "react-query";
import { BrowserRouter as Router } from "react-router-dom"
import EmployeeStore from "@/store/employee.ts";
import LoadingOverlayClass from "@/store/LoadingOverlay.ts";
import {createContext} from "react";
import React from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    },
});

interface ContextType {
    employee: EmployeeStore;
    overlay:LoadingOverlayClass
}

export const Context = createContext<ContextType>(
    {
        employee: new EmployeeStore(),
        overlay:new LoadingOverlayClass()
    })

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Router>
            <QueryClientProvider client={queryClient}>
                <Context.Provider value={
                    {
                        employee:new EmployeeStore(),
                        overlay: new LoadingOverlayClass()
                    }
                }>
                    <App />
                </Context.Provider>
            </QueryClientProvider>
        </Router>
    </React.StrictMode>

);
