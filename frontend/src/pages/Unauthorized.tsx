import { Link } from "react-router-dom";

export const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl text-red-500 mb-4">Unauthorized</h1>
            <p className="text-gray-600 mb-4">
                You do not have the required permissions to access this page.
            </p>
            <Link to="/" className="text-blue-500 hover:underline">
                Go to Home
            </Link>
        </div>
    );
};
