import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 mt-16">
        {/* children ko render krne ke liye hum <Outlet/> use krte hai jo ek trha ka component hota hai aur react router dom se aata hai  */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
