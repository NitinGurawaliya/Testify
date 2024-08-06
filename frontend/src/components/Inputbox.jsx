export function InputBox({onChange,placeholder}){
    return <div>
     <input className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" onChange={onChange} placeholder={placeholder} />
    </div>
}

export function PasswordInputBox({onChange,placeholder}){
    return <div>
        <input type="password" className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" onChange={onChange} placeholder={placeholder} />
    </div>
}