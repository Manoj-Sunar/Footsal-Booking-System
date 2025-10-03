import { useMemo } from "react"
import FutsalBookingMerged from "../../Pages/FootsalBooking"
import { useWeareHouse } from "../../WeareHouse/WeareHouseContext"


const AdminBookngSlotsMange = () => {
  const { AuthUser } = useWeareHouse()
  const admin = useMemo(() => {
    return AuthUser?.user?.isAdmin;
  }, [])

  return (
    <div>
      <FutsalBookingMerged isAdmin={admin && admin} />
    </div>
  )
}

export default AdminBookngSlotsMange