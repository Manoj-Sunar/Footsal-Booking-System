import { useMatchTimer } from "../WeareHouse/MatchTimeProvider";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} min : ${s.toString().padStart(2, "0")} sec`;
};

const StartMatch = ({ duration, slotId }) => {
  const {
    remaining,
    startMatch,
    stopMatch,
    resumeMatch,
    resetMatch,
    endTime,
    isRunning,
    activeSlotId,
  } = useMatchTimer();

  const isThisSlotActive = activeSlotId === slotId;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 bg-gray-900 rounded-2xl p-5">
      {!endTime || !isThisSlotActive ? (
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-xl text-2xl"
          onClick={() => startMatch(duration, slotId)}
          disabled={!!activeSlotId && !isThisSlotActive}
        >
          Start Match
        </button>
      ) : remaining > 0 ? (
        <>
          <p className="md:text-6xl text-3xl font-bold text-white">
            {formatTime(remaining)}
          </p>
          <div className="flex space-x-4">
            {isRunning ? (
              <button
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg text-lg"
                onClick={stopMatch}
              >
                Stop
              </button>
            ) : (
              <button
                className="px-6 py-2 bg-green-500 text-white rounded-lg text-lg"
                onClick={resumeMatch}
              >
                Continue
              </button>
            )}
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-lg text-lg"
              onClick={resetMatch}
            >
              Restart
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-4xl font-bold text-red-600">Match Finished</p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-lg"
            onClick={() => startMatch(duration, slotId)}
          >
            Restart
          </button>
        </>
      )}
    </div>
  );
};

export default StartMatch;
