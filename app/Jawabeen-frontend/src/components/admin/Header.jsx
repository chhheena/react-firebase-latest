import { Icon } from "@iconify/react";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="topbar">
      <div className="with-vertical">
        <nav className="navbar navbar-expand-lg p-0">
          <div className="d-block d-lg-none py-9 py-xl-0">
            <img src="../assets/images/logos/logo.svg" alt="matdash-img" />
          </div>

          <a
            className="navbar-toggler p-0 border-0 nav-icon-hover-bg rounded-circle"
            href="javascript:void(0)"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <Icon icon="solar:menu-dots-bold-duotone" className="fs-6"></Icon>
          </a>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <div className="d-flex align-items-center justify-content-between">
              <ul className="navbar-nav flex-row mx-auto ms-lg-auto align-items-center justify-content-center">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link"
                    href="javascript:void(0)"
                    id="drop1"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center gap-2 lh-base">
                      <img
                        src="../assets/images/profile/user-1.jpg"
                        className="rounded-circle"
                        width="35"
                        height="35"
                        alt="matdash-img"
                      />
                      <Icon icon="solar:alt-arrow-down-bold" className="fs-2" />
                    </div>
                  </a>

                  <div
                    className="dropdown-menu profile-dropdown dropdown-menu-end dropdown-menu-animate-up"
                    aria-labelledby="drop1"
                  >
                    <div className="position-relative px-4 pt-3 pb-2">
                      <div className="d-flex align-items-center mb-3 pb-3 border-bottom gap-6">
                        <img
                          src="../assets/images/profile/user-1.jpg"
                          className="rounded-circle"
                          width="56"
                          height="56"
                          alt="matdash-img"
                        />
                        <div>
                          <h5 className="mb-0 fs-12">
                            David McMichael{" "}
                            <span className="text-success fs-11">Pro</span>
                          </h5>
                          <p className="mb-0 text-dark">david@wrappixel.com</p>
                        </div>
                      </div>

                      <div className="message-body">
                        <a
                          href="javascript:void(0)"
                          className="p-2 dropdown-item h6 rounded-1"
                        >
                          My Profile
                        </a>
                        <span
                          className="p-2 dropdown-item h6 rounded-1 cursor-pointer"
                          onClick={handleLogout}
                          style={{ cursor: "pointer" }}
                        >
                          Logout
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
