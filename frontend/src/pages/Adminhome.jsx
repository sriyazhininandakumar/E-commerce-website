import React, { useEffect, useState } from "react";

const Adminhome = () => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        console.log("Fetching admin from localStorage...");
        const storedAdmin = localStorage.getItem("admin");
        console.log("Stored Admin Data:", storedAdmin);

        if (storedAdmin) {
            try {
                const parsedAdmin = JSON.parse(storedAdmin);
                console.log("Parsed Admin Data:", parsedAdmin);
                setAdmin(parsedAdmin);
            } catch (error) {
                console.error("Error parsing admin data:", error);
            }
        }
    }, []);

    if (!admin) {
        return (
            <div className="text-center text-gray-500 mt-6">

            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6 text-center">
            <h2 className="text-2xl font-bold">Welcome, {admin?.name || "Admin"}!</h2>
        </div>
    );
};

export default Adminhome;
