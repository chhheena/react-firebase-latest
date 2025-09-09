import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function Sidebar({ onToggle }) {
  const location = useLocation();

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
                  className={`sidebar-item ${
                    location.pathname.startsWith("/admin/dashboard")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="/admin/dashboard"
                    className={`sidebar-link ${
                      location.pathname === "/admin/dashboard" ? "active" : ""
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
                    to="/admin/dashboard"
                    className={`sidebar-link has-arrow  ${
                      location.pathname === "/admin/blog" ? "active" : ""
                    }`}
                    aria-expanded="false"
                  >
                    <Icon icon="solar:widget-4-line-duotone"></Icon>
                    <span className="hide-menu">Coffee Shop</span>
                  </Link>
                  {/* first-level in */}
                  <ul aria-expanded="false" className="collapse">
                    <li className="sidebar-item">
                      <Link
                        className={`sidebar-link ${
                          location.pathname === "/admin/blog-post"
                            ? "active"
                            : ""
                        }`}
                        to="/admin/blog-post"
                      >
                        <span className="icon-small"></span>Blog Posts
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link
                        to="/admin/blog-details"
                        className={`sidebar-link ${
                          location.pathname === "/admin/blog-details"
                            ? "active"
                            : ""
                        }`}
                      >
                        <span className="icon-small"></span>Blog Details
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-item">
                  <Link
                    to="/admin/user-list"
                    className={`sidebar-link ${
                      location.pathname === "/admin/user-list" ? "active" : ""
                    }`}
                    aria-expanded="false"
                  >
                    <Icon icon="solar:shield-user-line-duotone"></Icon>
                    Users
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
