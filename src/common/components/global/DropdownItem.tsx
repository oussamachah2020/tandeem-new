import * as Icons from "@heroicons/react/24/outline";
import {FC, ReactNode} from "react";

interface Props {
    icon: keyof typeof Icons
    onClick?: () => void
    children?: ReactNode
}

export const DropdownItem: FC<Props> = ({onClick, icon, children}) => {
    const Icon = Icons[icon]
    return (
        <li
            className="flex items-center py-1 px-2 hover:bg-gray-50 rounded-lg transition duration-200 cursor-pointer w-full"
            onClick={onClick}
        >
            <Icon className="w-5 h-5"/>
            {children}
        </li>
    )
}