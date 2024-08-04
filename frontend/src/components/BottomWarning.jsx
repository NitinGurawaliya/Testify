import { Link } from "react-router-dom";

export function BottomWarning({label,buttonText,to}){
    return <div className="mt-6 text-l text-gray-600 text-center">
        {label}
    
        <Link className="text-blue-900 font-semibold" to={to}>
            {buttonText}
        </Link>
    </div>
                
}