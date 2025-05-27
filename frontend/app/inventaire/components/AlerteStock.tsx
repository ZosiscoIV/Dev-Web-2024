import React from 'react';
import "../css/inventaire.css";

type ModalProps ={
    open: boolean;
    message: string[];
    onConfirm: () => void;
};
const AlertModal: React.FC<ModalProps> = ({open, message, onConfirm}) => {
    if (!open) return null

    return (
        <div className="modal-backdrop">

            <div className='modal'>
                {message.length === 0 ? (<h2 style={{fontWeight:"bold"}}>Aucun produit à faible stock</h2>):
                (
                <>
                <h2 style={{fontWeight:"bold"}}>Attention produits à faible stock</h2>
                <ul className="modal-list">
                    {message.map((msg, index) => (
                        <li key={index}> {msg}</li>
                    ))}
                </ul>
                </> 
                )}      
                <div className="modal-actions">
                    <button id="butyonInv" onClick={() => {onConfirm();}} className="btn confirm">OK</button>
                </div>
            </div>
        </div>
  );
};
export default AlertModal;
