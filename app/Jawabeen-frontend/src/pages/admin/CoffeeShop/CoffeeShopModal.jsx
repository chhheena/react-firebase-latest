import { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal.jsx";
import { useToast } from "../../../context/ToastProvider.jsx";
import CoffeeShopService from "../../../services/coffeeshopService.js";

const CoffeeShopModal = ({ show, handleClose, shop = null }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    // Shop Details
    shopID: "",
    shopName: "",
    contactEmail: "",
    contactPhone: "",

    // Branding
    brandingLogo: "",
    primaryColor: "",
    secondaryColor: "",
    tagline: "",

    // Categories
    enabledCategories: [],

    // Revenue & Devices
    revenueSharePercentage: "",
    assignedDevices: [],

    // Language & RTL
    language: "en",
    isRTL: false,
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        shopID: shop.shopID || "",
        shopName: shop.shopName || "",
        contactEmail: shop.contactEmail || "",
        contactPhone: shop.contactPhone || "",
        brandingLogo: shop.brandingLogo || "",
        primaryColor: shop.primaryColor || "",
        secondaryColor: shop.secondaryColor || "",
        tagline: shop.tagline || "",
        enabledCategories: shop.enabledCategories || [],
        revenueSharePercentage: shop.revenueSharePercentage || "",
        assignedDevices: shop.assignedDevices || [],
        language: shop.language || "en",
        isRTL: shop.isRTL || false,
      });
    }
  }, [shop]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveData = async () => {
    try {
      const result = await CoffeeShopService.saveCoffeeShop({
        ...formData,
        id: shop?.id,
      });

      showToast({ message: result.message, severity: "success" });
      handleCloseModal();
    } catch (error) {
      showToast({
        title: "Error Saving Coffee Shop",
        message: error.message,
        type: "danger",
      });
    }
  };

  const handleCloseModal = () => {
    setFormData({
      shopID: "",
      shopName: "",
      contactEmail: "",
      contactPhone: "",
      brandingLogo: "",
      primaryColor: "",
      secondaryColor: "",
      tagline: "",
      enabledCategories: [],
      revenueSharePercentage: "",
      assignedDevices: [],
      language: "en",
      isRTL: false,
    });
    handleClose();
  };

  const footer = (
    <>
      <button
        className="btn bg-danger-subtle text-danger"
        type="button"
        onClick={handleCloseModal}
      >
        Cancel
      </button>
      <button className="btn btn-success" type="button" onClick={saveData}>
        {shop ? "Update" : "Save"}
      </button>
    </>
  );

  return (
    <Modal
      show={show}
      title={shop ? "Update Coffee Shop" : "Add Coffee Shop"}
      footer={footer}
      onClose={handleCloseModal}
    >
      <form>
        {/* Shop Details */}
        <h5>Shop Details</h5>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="shopID"
              className="form-control"
              placeholder="Shop ID"
              value={formData.shopID}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="shopName"
              className="form-control"
              placeholder="Shop Name"
              value={formData.shopName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="email"
              name="contactEmail"
              className="form-control"
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="contactPhone"
              className="form-control"
              placeholder="Contact Phone"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>
        </div>
        

        {/* Branding */}
        <h5>Branding</h5>
        <div className="row mb-3">
          <div className="col-md-12 mb-3">
            <label className="form-label">Logo</label>
            <input
              type="file"
              name="brandingFile"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, brandingFile: e.target.files[0] }))
              }
            />
            {formData.brandingLogo && (
              <img
                src={formData.brandingLogo}
                alt="Current Logo"
                className="mt-2"
                style={{ height: "50px" }}
              />
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Primary Color</label>
            <input
              type="color"
              name="primaryColor"
              className="form-control"
              value={formData.primaryColor}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
             <label className="form-label">Secondary Color</label>
            <input
              type="color"
              name="secondaryColor"
              className="form-control"
              value={formData.secondaryColor}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="tagline"
            className="form-control"
            placeholder="Tagline"
            value={formData.tagline}
            onChange={handleChange}
          />
        </div>

        {/* Categories */}
        <h5>Enabled Categories</h5>
        <div className="mb-3">
          <div className="d-flex flex-wrap border p-2 rounded" style={{ minHeight: "45px" }}>
            {formData.enabledCategories.map((cat, idx) => (
              <div
                key={idx}
                className="badge bg-primary me-1 mb-1"
                style={{ display: "flex", alignItems: "center" }}
              >
                {cat}
                <span
                  className="ms-1"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      enabledCategories: prev.enabledCategories.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  &times;
                </span>
              </div>
            ))}

            <input
              type="text"
              className="form-control border-0 p-0"
              style={{ minWidth: "120px", flexGrow: 1 }}
              placeholder="Type category and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  e.preventDefault();
                  const newCat = e.target.value.trim();
                  if (!formData.enabledCategories.includes(newCat)) {
                    setFormData((prev) => ({
                      ...prev,
                      enabledCategories: [...prev.enabledCategories, newCat],
                    }));
                  }
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>


        {/* Revenue & Devices */}
        <h5>Revenue & Devices</h5>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="number"
              name="revenueSharePercentage"
              className="form-control"
              placeholder="Revenue Share (%)"
              value={formData.revenueSharePercentage}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-8">
            <input
              type="text"
              name="assignedDevices"
              className="form-control"
              placeholder="Device IDs (comma separated)"
              value={formData.assignedDevices.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  assignedDevices: e.target.value
                    .split(",")
                    .map((d) => d.trim()),
                }))
              }
            />
          </div>
        </div>

        {/* Language & RTL */}
        <h5>Language & RTL Settings</h5>
        <div className="row mb-3">
          <div className="col-md-4">
            <select
              name="language"
              className="form-control"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <label className="me-2">RTL</label>
            <input
              type="checkbox"
              name="isRTL"
              checked={formData.isRTL}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CoffeeShopModal;
