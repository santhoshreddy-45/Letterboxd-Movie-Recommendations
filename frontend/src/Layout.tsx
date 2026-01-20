import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import CustomAlert from "./components/Alerts/CustomAlert";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import LetterboxdAlert from "./components/Alerts/LetterboxdAlert";

function Layout() {
    return (
        <>
            <Header />
            <div className="flex flex-col min-h-screen">
                <CustomAlert
                    severity="error"
                    message="Currently experiencing technical error while fetching user ratings - sorry for the inconvenience!"
                />
                <div className="grow">
                    <Outlet />
                </div>
                <LetterboxdAlert />
                <Footer />
                <Analytics />
            </div>
        </>
    );
}

export default Layout;
