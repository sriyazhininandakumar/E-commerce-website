import React, { useEffect, useState } from "react";

const ManufacturerHome = () => {
    const [manufacturer, setManufacturer] = useState(null);

    useEffect(() => {
        console.log("Fetching manufacturer from localStorage...");
        const storedManufacturer = localStorage.getItem("manufacturer");
        console.log("Stored Manufacturer Data:", storedManufacturer);

        if (storedManufacturer) {
            try {
                const parsedManufacturer = JSON.parse(storedManufacturer);
                console.log("Parsed Manufacturer Data:", parsedManufacturer);
                setManufacturer(parsedManufacturer);
            } catch (error) {
                console.error("Error parsing manufacturer data:", error);
            }
        }
    }, []);

    if (!manufacturer) {
        return (
            <div className="text-center text-gray-500 mt-6">
                <p>Loading manufacturer data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6 text-center">
            <h2 className="text-2xl font-bold">Welcome, {manufacturer.name}!</h2>
            
        </div>
    );
};

export default ManufacturerHome;
