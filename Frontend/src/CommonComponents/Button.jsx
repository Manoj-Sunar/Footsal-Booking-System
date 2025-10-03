import { Loader2 } from "lucide-react";
import { memo } from "react";

const Button = memo(({type, label, onClick, className = "",Loading, ...props }) => (
    <button
     type={type}
        onClick={onClick}
        {...props}
        className={`px-6 py-2   rounded-lg shadow-md flex items-center justify-center transition-all duration-300 ${className}`}
    >
        {Loading?<Loader2 className="animate-spin text-center"/>:label}
    </button>
));

export default Button;
