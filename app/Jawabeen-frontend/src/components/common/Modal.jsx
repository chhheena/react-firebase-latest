const Modal = ({ show, title, children, footer, onClose, size = "md" }) => {
  if (!show) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark
          zIndex: 1040,
        }}
        onClick={onClose} // Allow clicking background to close modal
      />

      {/* Modal dialog */}
      <div
        className={`modal fade show d-block`}
        role="dialog"
        aria-hidden={!show}
        style={{ zIndex: 1050 }} // Ensure it's above the backdrop
      >
        <div
          className={`modal-dialog modal-dialog-centered modal-${size}`}
          role="document"
        >
          <div className="modal-content">
            {/* Header */}
            {title && (
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>
            )}

            {/* Body */}
            <div className="modal-body">{children}</div>

            {/* Footer */}
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
