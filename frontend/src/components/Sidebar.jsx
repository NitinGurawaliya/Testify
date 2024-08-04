
import Dashnav from "./Dashnav"
import { useNavigate } from "react-router-dom";

export function Sidebar() {

    const navigate = useNavigate()

    function toPurchases(){
        navigate("/purchases")
    }

    function createcourse(){
        navigate("/createcourse")
    }

    function logoutUser(){
        localStorage.removeItem("token");
        localStorage.removeItem("username")
        navigate("/signin")
    }

    return (
        <>
            <div className="fixed overflow-auto w-20 px-0 top-16 bottom-0 left-0 bg-blue-100 md:w-60 flex m-0 flex-col space-y-8 p-4">

            <SidebarButton  label={"My Tests "} />
            <SidebarButton onClick={createcourse} label={"Create Test "} />
            <SidebarButton onClick={logoutUser}  label={"Logout"} />
                
            </div>
        </>
    );
}


 export function SidebarButton({label,onClick}){
    return <div className="text-4xl m-0 p-0  font-bold ">
    <Button onClick={onClick} label={label} />
    </div>
}

export function Button({ onClick, label }) {
    return (
        <button 
            onClick={onClick} 
            type="button" 
            className="mt-3  text-black w-full h-8 rounded-lg  text-sm hover:bg-green-400 active:bg-slate-50 active:text-black"
        >
            {label}
        </button>
    );
}
