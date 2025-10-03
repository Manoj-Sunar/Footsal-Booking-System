import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PackagePlus, PlusCircle } from 'lucide-react';
import { useLocation, useParams } from "react-router-dom";

const ModalContext = createContext(null);


// Central single source of truth for the action button by route
// "path" should match your app routes (longest path should win)



export const ModalProvider = ({ children }) => {

    const location = useLocation();



    const ACTION_BUTTONS = [

        {

        },

    ];


    const [state, setState] = useState({ isOpen: false, type: null, props: {} });


    const openModal = useCallback((type, props = {}) => {
        setState({ isOpen: true, type, props });
    }, []);


    const closeModal = useCallback(() => {
        setState((s) => ({ ...s, isOpen: false }));
    }, []);


    // Pick the longest matching path for current location
    const actionButton = useMemo(() => {
        const pathname = location.pathname;
        const match = ACTION_BUTTONS
            .filter((item) => pathname.startsWith(item.path) || pathname.includes(item.path))
            .sort((a, b) => b.path.length - a.path.length)[0];


        if (!match) return null;


        return {
            ...match,
            onClick: () => openModal(match.modal),
        };
    }, [location.pathname, openModal]);


    const value = useMemo(
        () => ({ ...state, openModal, closeModal, actionButton }),
        [state, openModal, closeModal, actionButton]
    );


    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModal = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal must be used within ModalProvider");
    return ctx;
};


export const useActionButton = () => {
    const { actionButton } = useModal();
    return actionButton;
};