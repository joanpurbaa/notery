import { ChevronRight } from "lucide-react";

export default function DropDown({ label, value, setValue, list, Open, setOpen }) {

    return (
        <div className="relative w-full">
            <button
                onClick={setOpen}
                className="w-full py-3 px-4 border border-[#b1b1b1] rounded-lg flex justify-between items-center bg-[#F9F9F9] text-[#808080]"
            >
                {value || label}
                <ChevronRight
                    className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"
                        }`}
                    color="black"
                />
            </button>

            {Open && (
                <ul
                    className="scroll-custom absolute z-10 mt-1 w-[400px] max-h-[350px]
                     overflow-y-auto bg-white border border-[#F9F9F9] rounded-md shadow right-1
                     space-y-5"
                    style={{ display: open ? "block" : "none" }}
                >
                    {list.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setValue(item);
                                setOpen("");
                            }}
                            className={`px-4 py-2  hover:bg-gray-100 cursor-pointer ${value === item ? "bg-gray-100 font-semibold" : ""
                                }`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
