import React, { createContext, useContext, useState } from 'react';
import Popup from "../components/Popup";

type PopupData = {
    url: string;
    title: string;
    description: string;
};

type PopupContextType = {
    openPopup: (data: PopupData) => void;
    closePopup: () => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupData, setPopupData] = useState<PopupData | null>(null);

    const openPopup = (data: PopupData) => {
        setPopupData(data);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setPopupData(null);
    };

    return (
        <PopupContext.Provider value={{ openPopup, closePopup }}>
            {children}
            {popupData && (
                <Popup
                    visible={popupVisible}
                    close={closePopup}
                    url={popupData.url}
                    title={popupData.title}
                    description={popupData.description}
                    confirmLabel="Aller"
                    cancelLabel="Rester ici"
                />
            )}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};
