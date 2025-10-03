
import './App.css'
import { Route, Routes } from "react-router-dom";

import Layout from './Layout/Layout';
import Home from './Pages/Home';

import PaymentMethod from './Pages/PaymentMethod';

import Contact from './Pages/Contact';
import Login from './AuthPages/Login';
import Register from './AuthPages/Register';
import ProfileLayout from './Layout/ProfileLayout';
import BookingDetails from './Pages/UserProfile/BookingDetails';
import PageNotFound from './Pages/PageNotFound';
import AdminLayout from './Admin/admin-layout/AdminLayout';
import AdminDashboard from './Admin/admin-pages/AdminDashboard';
import AdminBooking from './Admin/admin-pages/AdminBooking';
import { ModalProvider } from './ModalSystem/ModalContext';
import { MatchTimerProvider } from './WeareHouse/MatchTimeProvider';
import AdminBookngSlotsMange from './Admin/admin-pages/AdminBookngSlotsMange';
import FutsalBookingMerged from './Pages/FootsalBooking';
import AdminAllCustomers from './Admin/admin-pages/AdminAllCustomers';
import AdminSettings from './Admin/admin-pages/AdminSettings';
import UserSettings from './Pages/UserProfile/UserSettings';
import ForgotPassword from './AuthPages/ForgotPassword';




function App() {


  return (
    <>
      <ModalProvider>
        <MatchTimerProvider>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              
              <Route path='/booking-slots' element={<FutsalBookingMerged />} />
              <Route path='/payment-method/:bookingId/:day/:slotId/:timeSlotId' element={<PaymentMethod />} />
              
              <Route path='/contact' element={<Contact />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword/>} />


            <Route path='/profile' element={<ProfileLayout />}>
              <Route path='booking-details' element={<BookingDetails />} />
              <Route path='settings' element={<UserSettings />} />
            </Route>

            <Route path='*' element={<PageNotFound />} />

            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path='booking-slots-manage' element={<AdminBookngSlotsMange />} />
              <Route path='bookings' element={<AdminBooking />} />
              <Route path='users' element={<AdminAllCustomers/>} />
              <Route path='settings' element={<AdminSettings/>} />
            </Route>

          </Routes>
        </MatchTimerProvider>
      </ModalProvider>

    </>
  )
}

export default App
