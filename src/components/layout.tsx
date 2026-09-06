import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const Layout = () => {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout