import React from "react";
import { LockKeyhole, ShieldAlert } from "lucide-react";

const RestrictedAccessPage = () => {
    // This is a demo page to show what happens when a user doesn't have access
    // In a real implementation, this page would be protected by an auth check
    const hasAccess = false; // Set to false to demonstrate restricted access

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
                <div className="bg-red-50 border-2 border-red-100 rounded-lg p-8 max-w-2xl w-full text-center">
                    <div className="flex justify-center mb-4">
                        <ShieldAlert className="h-16 w-16 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-red-700 mb-2">Access Restricted</h1>
                    <p className="text-gray-700 mb-6">
                        You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
                    </p>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                        <LockKeyhole className="h-5 w-5 text-gray-500" />
                        <p className="text-sm text-gray-600">Permission required: <span className="font-medium">RestrictedPageAccess</span></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Restricted Content</h1>
            <p>This content is only visible to users with the appropriate permissions.</p>
        </div>
    );
};

export default RestrictedAccessPage;
