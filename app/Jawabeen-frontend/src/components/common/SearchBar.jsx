import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        className="form-control product-search ps-5"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
    </form>
  );
};

export default SearchBar;
