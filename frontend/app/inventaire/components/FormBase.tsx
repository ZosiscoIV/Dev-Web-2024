import React, { JSX, useState } from 'react';
import ConfirmModal from './PopUp'; 

type FormBaseProps = {
    title: string;
    message: string;
    handleSubmit: () => void;
    onClose: () => void;
    formField: JSX.Element;
};

const FormulaireBase: React.FC<FormBaseProps> = ({title, message, handleSubmit, onClose, formField}) => {
    
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };
    const handleConfirm = () => {
        handleSubmit();
        setShowModal(false);
        onClose();
        
    };
    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <div className="popup-inner">
            <form onSubmit={handleOpenModal}>
                {formField}
                <label> 
                    <input type="submit"/>
                </label>
                <button id="butyonInv" type="button" onClick={onClose}>Annuler</button>
            </form>
            {showModal && (
                <ConfirmModal
                    open={showModal}
                    title={title}
                    message={message}
                    onClose={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
            
        </div>
    );
};
export default FormulaireBase;