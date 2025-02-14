import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavAdmin from "../components/NavAdmin";
import Adminhome from "./Adminhome";
import AdminProducts from "./AdminProducts";
import AdminProfile from "./AdminProfile";

const AdminLayout = ({ signOut }) => {
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

    return (
        <div>
            <NavAdmin />

            <div className="p-4">
                <Routes>
                    <Route index element={<Navigate to="home" />} />
                    <Route path="home" element={<Adminhome admin={admin} />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="profile" element={<AdminProfile admin={admin} signOut={signOut} />} />
                </Routes>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
