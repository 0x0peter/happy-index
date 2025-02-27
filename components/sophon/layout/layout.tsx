import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
    
            <main className='flex-grow container mx-auto p-4'>
                {children}
            </main>
            
        </div>
    );
};


export default Layout;
