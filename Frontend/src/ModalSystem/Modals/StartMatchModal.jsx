import StartMatch from "../../CommonComponents/StartMatch";

const StartMatchModal = ({ duration, slotId,slot }) => {
  console.log(duration);
  console.log(slot)
  console.log(slotId)
  return (
    <div className="w-full h-full flex items-center justify-center">
      <StartMatch duration={duration} slotId={slotId} />
    </div>
  );
};

export default StartMatchModal;
