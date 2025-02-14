import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavManufacturer from "../components/NavManufacturer"
import ManufacturerHome from "./ManufacturerHome";
import ManufacturerOrders from "./ManufacturerOrders";
import ManufacturerProfile from "./ManufacturerProfile";

const ManufacturerLayout = ({ signOut }) => {
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

    return (
        <div>
            <NavManufacturer />
            <div className="p-4">
                <Routes>
                    <Route index element={<Navigate to="home" />} />
                    <Route path="home" element={<ManufacturerHome manufacturer={manufacturer} />} />
                    <Route path="orders" element={<ManufacturerOrders />} />
                    <Route path="profile" element={<ManufacturerProfile manufacturer={manufacturer} signOut={signOut} />} />
                </Routes>
                <Outlet />
            </div>
        </div>
    );
};

export default ManufacturerLayout;
