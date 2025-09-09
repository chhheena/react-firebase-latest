import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

export default function Layout() {
  const handleSidebarToggle = () => {
    const body = document.body;
    if (body.getAttribute("data-sidebartype") === "full") {
      body.setAttribute("data-sidebartype", "mini-sidebar");
    } else {
      body.setAttribute("data-sidebartype", "full");
    }
  };

  return (
    <div id="main-wrapper">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className="page-wrapper">
        <Header />
        <div className="body-wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
