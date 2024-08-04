export function  Searchbar() {
    return (
        <div className="border  flex justify-center border-slate-200 rounded-full overflow-hidden">
            <input 
                type="text" 
                placeholder="Search a test .." 
                className="px-4 py-2  right-56 focus:outline-none focus:ring-2 "
            />
        </div>
        
    );
}
