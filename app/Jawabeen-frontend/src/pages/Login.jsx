import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  loginWithEmail,
  registerWithEmail,
  logout as logoutService,
} from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login existing user
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await loginWithEmail(email, password);
      setUser(loggedInUser);
      alert("Logged in as: " + loggedInUser.email);
      // Redirect after login
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const registeredUser = await registerWithEmail(email, password);
      setUser(registeredUser);
      alert("Registered and logged in as: " + registeredUser.email);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutService();
      setUser(null);
      setEmail("");
      setPassword("");
      alert("Logged out successfully");
    } catch (err) {
      alert("Error logging out: " + err.message);
    }
  };

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="position-relative overflow-hidden auth-bg min-vh-100 w-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center w-100">
        <div className="row justify-content-center w-100 my-5 my-xl-0">
          <div className="col-md-9 d-flex flex-column justify-content-center">
            <div className="card mb-0 bg-body auth-login m-auto w-100">
              <div className="row gx-0">
                <div className="col-xl-6 border-end">
                  <div className="row justify-content-center py-4">
                    <div className="col-lg-11">
                      <div className="card-body">
                        {/* Logo */}
                        <div className="text-center mb-4">
                          <img
                            src="/assets/images/logos/logo.svg"
                            alt="Logo"
                            className="dark-logo"
                            width="120"
                          />
                        </div>

                        <h2 className="lh-base mb-4">
                          Let's get you signed in
                        </h2>

                        <div className="position-relative text-center my-4">
                          <p className="mb-0 fs-12 px-3 d-inline-block bg-body z-index-5 position-relative">
                            Or sign in with email
                          </p>
                          <span className="border-top w-100 position-absolute top-50 start-50 translate-middle"></span>
                        </div>

                        {/* Email + Password Form */}
                        <form onSubmit={handleLogin}>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Email Address
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <label htmlFor="password" className="form-label">
                                Password
                              </label>
                              <a
                                href="/forgot-password"
                                className="text-primary fs-6"
                              >
                                Forgot Password?
                              </a>
                            </div>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>

                          {/* Error Message */}
                          {error && <p className="text-danger">{error}</p>}

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-dark w-100 py-2 mb-2 rounded-1"
                          >
                            {loading ? "Signing in..." : "Sign In"}
                          </button>

                          <button
                            type="button"
                            onClick={handleRegister}
                            disabled={loading}
                            className="btn btn-secondary w-100 py-2 rounded-1"
                          >
                            {loading ? "Processing..." : "Register"}
                          </button>
                        </form>

                        <div className="d-flex align-items-center mt-3">
                          <p className="fs-12 mb-0 fw-medium">
                            Don’t have an account yet?
                          </p>
                          <a
                            className="text-primary fw-semibold ms-2"
                            href="#"
                            onClick={handleRegister}
                          >
                            Sign Up Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side carousel (optional) */}
                <div className="col-xl-6 d-none d-xl-block">
                  <div className="row justify-content-center align-items-start h-100">
                    <div className="col-lg-9">
                      <div
                        id="auth-login"
                        className="carousel slide auth-carousel mt-5 pt-4"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-indicators">
                          <button
                            type="button"
                            data-bs-target="#auth-login"
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                          ></button>
                          <button
                            type="button"
                            data-bs-target="#auth-login"
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                          ></button>
                          <button
                            type="button"
                            data-bs-target="#auth-login"
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                          ></button>
                        </div>
                        <div className="carousel-inner">
                          <div className="carousel-item active text-center">
                            <img
                              src="/assets/images/backgrounds/login-side.png"
                              alt="login-side"
                              width="300"
                              className="img-fluid mb-3"
                            />
                            <h4 className="mb-0">Feature Rich 3D Charts</h4>
                            <p className="fs-12 mb-0">
                              Donec justo tortor, malesuada vitae faucibus ac,
                              tristique sit amet massa.
                            </p>
                          </div>
                          <div className="carousel-item text-center">
                            <img
                              src="/assets/images/backgrounds/login-side.png"
                              alt="login-side"
                              width="300"
                              className="img-fluid mb-3"
                            />
                            <h4 className="mb-0">Feature Rich 2D Charts</h4>
                            <p className="fs-12 mb-0">
                              Aliquam dignissim nec felis quis imperdiet.
                            </p>
                          </div>
                          <div className="carousel-item text-center">
                            <img
                              src="/assets/images/backgrounds/login-side.png"
                              alt="login-side"
                              width="300"
                              className="img-fluid mb-3"
                            />
                            <h4 className="mb-0">Feature Rich 1D Charts</h4>
                            <p className="fs-12 mb-0">
                              Donec justo tortor, malesuada vitae faucibus.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Right side */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
