import { useState, useEffect } from "react";
import Modal from "../../../../components/common/Modal.jsx";
import { useToast } from "../../../../context/ToastProvider.jsx";
import questionService from "../../../../services/questionService.js";
import coffeeShopService from "../../../../services/coffeeshopService.js";

const CategoryModal = ({ show, handleClose, category = null }) => {
  const { showToast } = useToast();
  const [shops, setShops] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    enabledShops: [],
    status: "active",
  });

  useEffect(() => {
    // fetch shops
    const fetchShops = async () => {
      try {
        const data = await coffeeShopService.fetchCoffeeShops();
        setShops(data);
      } catch (error) {
        showToast({ message: error.message, severity: "error" });
      }
    };
    fetchShops();
  }, []);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        nameAr: category.nameAr || "",
        enabledShops: category.enabledShops || [],
        status: category.status || "active",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // shop select
  const handleShopSelect = (shopId) => {
    if (!formData.enabledShops.includes(shopId)) {
      setFormData((prev) => ({
        ...prev,
        enabledShops: [...prev.enabledShops, shopId],
      }));
    }
    setDropdownOpen(false);
  };

  // remove selected shop
  const handleRemoveShop = (shopId) => {
    setFormData((prev) => ({
      ...prev,
      enabledShops: prev.enabledShops.filter((id) => id !== shopId),
    }));
  };

  const saveData = async () => {
    try {
      const result = await questionService.saveCategory({
        ...formData,
        id: category?.id,
      });
      showToast({ message: result.message, severity: "success" });
      handleCloseModal();
    } catch (error) {
      showToast({ message: error.message, severity: "error" });
    }
  };

  const handleCloseModal = () => {
    setFormData({ name: "", nameAr: "", enabledShops: [], status: "active" });
    handleClose();
  };

  const footer = (
    <>
      <button className="btn bg-danger-subtle text-danger" onClick={handleCloseModal}>
        Cancel
      </button>
      <button className="btn btn-success" onClick={saveData}>
        {category ? "Update" : "Save"}
      </button>
    </>
  );

  return (
    <Modal
      show={show}
      title={category ? "Update Category" : "Add Category"}
      footer={footer}
      onClose={handleCloseModal}
    >
      <form>
        <div className="mb-3">
          <label className="form-label">Name (English)</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Name (Arabic)</label>
          <input
            type="text"
            name="nameAr"
            className="form-control"
            value={formData.nameAr}
            onChange={handleChange}
          />
        </div>

        {/* Enabled Shops with tags + dropdown */}
        {/* Enabled Shops with tags + dropdown */}
        <div className="mb-3">
          <label className="form-label">Enabled Shops</label>
          <div
            className="form-control d-flex flex-wrap align-items-center"
            style={{ minHeight: "45px", cursor: "pointer" }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {formData.enabledShops.map((id) => {
              const shop = shops.find((s) => s.id === id);
              return (
                <span
                  key={id}
                  className="badge bg-primary me-2 mb-1 d-flex align-items-center"
                  style={{ gap: "5px", padding: "6px 8px" }}
                >
                  {shop?.shopName || id}
                  <span
                    style={{
                      cursor: "pointer",
                      color: "white",
                      fontSize: "14px",
                      lineHeight: "1",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveShop(id);
                    }}
                  >
                    ×
                  </span>
                </span>
              );
            })}
            <input
              type="text"
              className="border-0 flex-grow-1"
              style={{ outline: "none" }}
              placeholder="Select shops..."
              readOnly
            />
          </div>

          {dropdownOpen && (
            <div
              className="border rounded mt-1 p-2 bg-white shadow-sm"
              style={{ maxHeight: "150px", overflowY: "auto", zIndex: 1000, position: "absolute" }}
            >
              {shops
                .filter((s) => !formData.enabledShops.includes(s.id))
                .map((shop) => (
                  <div
                    key={shop.id}
                    className="dropdown-item py-1 px-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShopSelect(shop.id)}
                  >
                    {shop.shopName}
                  </div>
                ))}
              {shops.filter((s) => !formData.enabledShops.includes(s.id)).length === 0 && (
                <div className="text-muted">All shops selected</div>
              )}
            </div>
          )}
        </div>


        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
