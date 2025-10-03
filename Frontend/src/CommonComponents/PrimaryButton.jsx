// CommonComponents/PrimaryButton.jsx
const PrimaryButton = ({ label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all duration-300 ${className}`}
  >
    {label}
  </button>
);

export default PrimaryButton;
