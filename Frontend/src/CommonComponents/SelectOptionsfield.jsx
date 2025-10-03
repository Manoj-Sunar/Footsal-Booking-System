import ErrorMessage from "./ErrorMessage";


// ===== Select Field Component =====
const SelectOptionsfield = ({ label, name, options, value, onChange, error, ...props }) => {

    const hasError = !!error?.[name];
    const commonClass = `peer w-full p-3 pt-2 border rounded-md focus:ring outline-none transition-all duration-200 
      ${hasError ? "border-red-500 focus:ring-red-300 focus:border-red-500" : "border-gray-300 focus:ring-green-300 focus:border-green-500"}
    `;



    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={commonClass}
                {...props}
            >
               
                {options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>

            <ErrorMessage message={error?.[name]}/>
        </div>
    )
};

export default SelectOptionsfield;