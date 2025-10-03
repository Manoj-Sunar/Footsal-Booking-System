
import BookingForm from '../../Components/BookingForm'

const AdminBookingEditModal = ({ bookingRow }) => {


    return (
        <div>
            <BookingForm isEdit={true} bookingEdit={bookingRow}/>
        </div>
    )
}

export default AdminBookingEditModal