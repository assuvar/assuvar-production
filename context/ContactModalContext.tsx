'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ContactModalMode = 'client' | 'partner';

interface ContactModalContextType {
    isOpen: boolean;
    mode: ContactModalMode;
    openContactModal: (mode?: ContactModalMode) => void;
    closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<ContactModalMode>('client');

    const openContactModal = (preferredMode: ContactModalMode = 'client') => {
        setMode(preferredMode);
        setIsOpen(true);
    };

    const closeContactModal = () => {
        setIsOpen(false);
    };

    return (
        <ContactModalContext.Provider value={{ isOpen, mode, openContactModal, closeContactModal }}>
            {children}
        </ContactModalContext.Provider>
    );
}

export function useContactModal() {
    const context = useContext(ContactModalContext);
    if (!context) {
        throw new Error('useContactModal must be used within a ContactModalProvider');
    }
    return context;
}
