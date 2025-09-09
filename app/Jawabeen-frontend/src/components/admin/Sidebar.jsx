import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Sidebar({ onToggle }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(""); // track open first-level menu

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <aside className="side-mini-panel with-vertical">
      <div className="iconbar">
        <div>
          <div className="mini-nav">
            <div className="brand-logo d-flex align-items-center justify-content-center">
              <a
                className="nav-link sidebartoggler"
                id="headerCollapse"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onToggle(); // parent se function call
                }}
              >
                <Icon
                  icon="solar:hamburger-menu-line-duotone"
                  className="fs-7"
                />
              </a>
            </div>
            <ul className="mini-nav-ul" data-simplebar>
              <li className="mini-nav-item" id="mini-1">
                <a
                  href="javascript:void(0)"
                  data-bs-toggle="tooltip"
                  data-bs-custom-class="custom-tooltip"
                  data-bs-placement="right"
                  data-bs-title="Dashboards"
                >
                  <Icon
                    icon="solar:layers-line-duotone"
                    className="fs-7"
                  ></Icon>
                </a>
              </li>

              <li className="mini-nav-item" id="mini-3">
                <Link to={"/"}>
                  <Icon icon="solar:notes-line-duotone" className="fs-7"></Icon>
                </Link>
              </li>

              <li className="mini-nav-item" id="mini-4">
                <a
                  href="javascript:void(0)"
                  data-bs-toggle="tooltip"
                  data-bs-custom-class="custom-tooltip"
                  data-bs-placement="right"
                  data-bs-title="Forms"
                >
                  <Icon
                    icon="solar:palette-round-line-duotone"
                    className="fs-7"
                  ></Icon>
                </a>
              </li>
            </ul>
          </div>
          <div className="sidebarmenu">
            <div className="brand-logo d-flex align-items-center nav-logo">
              <a href="./main/index.html" className="text-nowrap logo-img">
                <img src="../assets/images/logos/logo.svg" alt="Logo" />
              </a>
            </div>

            <nav
              className="sidebar-nav"
              id="menu-right-mini-1"
              data-simplebar
              style={{ display: "block" }}
            >
              <ul className="sidebar-menu" id="sidebarnav">
                <li>
                  <span className="sidebar-divider"></span>
                </li>
                <li
                  className={`sidebar-item ${location.pathname.startsWith("/admin/dashboard")
                      ? "active"
                      : ""
                    }`}
                >
                  <Link
                    to="/admin/dashboard"
                    className={`sidebar-link ${location.pathname === "/admin/dashboard" ? "active" : ""
                      }`}
                    aria-expanded={
                      location.pathname.startsWith("/admin/dashboard")
                        ? "true"
                        : "false"
                    }
                  >
                    <Icon icon="solar:shield-user-line-duotone" />
                    Dashboard
                  </Link>
                </li>

                <li className="sidebar-item">
                  <Link
                    to="/admin/user-list"
                    className={`sidebar-link ${location.pathname === "/admin/user-list" ? "active" : ""
                      }`}
                    aria-expanded="false"
                  >
                    <Icon icon="solar:shield-user-line-duotone"></Icon>
                    Users
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link
                    to="/admin/coffee-shop-list"
                    className={`sidebar-link ${location.pathname === "/admin/coffee-shop-list" ? "active" : ""
                      }`}
                    aria-expanded="false"
                  >
                    <Icon icon="solar:shield-user-line-duotone"></Icon>
                    Coffee Shops
                  </Link>
                </li>

                <li className="sidebar-item">
                  <div
                    className={`sidebar-link has-arrow ${location.pathname.startsWith("/admin/blog") ? "active" : ""
                      }`}
                    onClick={() => toggleMenu("questions")}
                    style={{ cursor: "pointer" }}
                    aria-expanded={openMenu === "questions" ? "true" : "false"}
                  >
                    <Icon icon="solar:widget-4-line-duotone" />
                    <span className="hide-menu">Questions</span>
                  </div>

                  <ul className={`collapse ${openMenu === "questions" ? "show" : ""}`}>
                    <li className="sidebar-item">
                      <Link
                        className={`sidebar-link ${location.pathname === "/admin/questions" ? "active" : ""}`}
                        to="/admin/questions"
                      >
                        <span className="icon-small"></span>List
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link
                        className={`sidebar-link ${location.pathname === "/admin/question-categories" ? "active" : ""}`}
                        to="/admin/question-categories"
                      >
                        <span className="icon-small"></span>Category
                      </Link>
                    </li>
                  </ul>
                </li>

                
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
