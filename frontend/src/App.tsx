import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import HotelsPage from './pages/Hotels';
import Contact from './pages/contact';

// ADMIN
import UpdateHotel from './pages/admin/hotel/UpdateHotel';
import CreateHotel from './pages/admin/hotel/CreateHotel';
import AdminHotels from './pages/admin/hotel/AdminHotels';
import AdminDashboard from "./pages/admin/dashboard";

import Dashboard_Metrics from './pages/admin/dashboard_metrics';

import CreateRoom from './pages/admin/room/CreateRoom';
import UpdateRoom from './pages/admin/room/UpdateRoom';

// PUBLIC
import HotelDetails from './pages/HotelsDetails';
import AdminHotelDetails from './pages/admin/room/AdminRooms';
import AvailableRooms from './pages/availableRooms';
import UserReservations from './pages/reservations';
import UserProfile from './pages/profile';
import UserEdit from './pages/profile-edit';
import AdminHotelReservations from './pages/admin/hotel/reservations';
import AdminRoomReservations from './pages/admin/room/reservations';
import AdminUsers from './pages/admin/users/users';
import AdminUserReservations from './pages/admin/users/reservations';
import AdminProfile from './pages/admin/profile';
import AdminEdit from './pages/admin/update-profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/hotels/:id/available-rooms" element={<AvailableRooms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reservations" element={<UserReservations />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<UserEdit />} />

        {/* ADMIN HOTEL */}
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/profile/edit" element={<AdminEdit />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:userId/reservations" element={<AdminUserReservations />} />
        <Route path="/admin/hotels" element={<AdminHotels />} />
        <Route path="/admin/create-hotel" element={<CreateHotel />} />
        <Route path="/admin/update-hotel/:id" element={<UpdateHotel />} />
        <Route path="/admin/hotels/:hotelId/reservations" element={<AdminHotelReservations />} />

        {/* ADMIN ROOMS */}
        <Route path="/admin/hotels/:id/rooms" element={<AdminHotelDetails />} />
        <Route path="/admin/hotels/:id/create-room" element={<CreateRoom />} />
        <Route path="/admin/hotels/:id/update-room/:id" element={<UpdateRoom />} />
        <Route path="/admin/hotels/:id/details-room/:id" element={<UpdateRoom />} />
        <Route path="/admin/hotels/:hotelId/rooms/:roomId" element={<AdminRoomReservations   />} />


        {/* DASHBOARD */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/*  TON NOUVEAU FEATURE */}
        <Route path="/admin/metrics" element={<Dashboard_Metrics />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;