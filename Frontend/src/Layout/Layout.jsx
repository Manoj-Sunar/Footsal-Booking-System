import Footer from '../CommonComponents/Footer'
import Navbar from '../CommonComponents/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-1 pt-16">
                <Outlet />
            </main>

            {/* Footer (Optional for full responsive layout) */}
            <footer className="bg-green-700 text-white text-center py-4 mt-auto">
                <Footer/>
            </footer>
        </div>
    )
}

export default Layout
