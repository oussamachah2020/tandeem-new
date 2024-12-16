import * as Icons from "@heroicons/react/24/outline";
import {FC, ReactNode} from "react";

interface Props {
    tabs: {
        icon: keyof typeof Icons
        text: string
        onClick: () => void
    }[],
    selectedTabIndex: number
    children?: ReactNode
}

const Tab: FC<Props> = ({tabs, selectedTabIndex, children}) =>
    <>
        <div className="text-center text-gray-500 border-b border-gray-200">
            <ul className="flex flex-wrap gap-2 -mb-px">
                {tabs.map(({icon, text, onClick}, idx) => {
                    const Icon = Icons[icon as keyof typeof Icons]
                    return (
                        <li
                            key={idx}
                            className={`flex justify-center items-center gap-3 p-4 cursor-pointer border-b-2 ${selectedTabIndex === idx ? 'text-primary border-primary' : 'border-transparent hover:text-primary hover:border-primary transition duration-200'}`}
                            onClick={onClick}
                        >
                            <Icon className='w-7 h-7'/>
                            {text}
                        </li>

                    )
                })}
            </ul>
        </div>
        <div className='py-6'>
            {children}
        </div>
    </>

export default Tab