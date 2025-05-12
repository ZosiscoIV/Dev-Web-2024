import React from 'react';
import "../css/inventaire.css";

type ModalProps ={
    open: boolean;
    title: string;
    message: string
    onClose: () => void;
    onConfirm: () => void;
};

const ConfirmModal: React.FC<ModalProps> = ({open, title,message, onClose, onConfirm}) => {
  if (!open) return null

  return (
    <div className="modal-backdrop">
      <div className='modal'>
        <h2 style={{fontWeight:"bolder"}}>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn cancel">Annuler</button>
          <button onClick={() => { onConfirm(); onClose();}} className="btn confirm">Confirmer</button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;
