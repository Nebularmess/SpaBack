import React from "react";
import "./ModalForm.css";

const Modal = ({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {children}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;