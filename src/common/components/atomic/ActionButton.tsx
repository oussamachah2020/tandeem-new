import * as Icons from "@heroicons/react/24/outline";
import {FC, SyntheticEvent, useMemo} from "react";
import {Tooltip} from "react-tooltip";
import {md5Hash} from "@/common/utils/functions";

interface Props {
    icon: keyof typeof Icons
    hoverColor?: string
    onClick?: () => void
    tooltip?: string
}


const ActionButton: FC<Props> = ({icon, hoverColor, onClick, tooltip}) => {
    const randomId = useMemo(() => tooltip && md5Hash(tooltip), [])
    const Icon = Icons[icon]
    const handleClick = (e: SyntheticEvent<any>) => {
        e.stopPropagation()
        if (onClick) onClick()
    }

    return (
        <>
            {tooltip && <Tooltip id={randomId} content={tooltip}/>}
            <button
                className={`bg-gray-100 p-2 ml-2.5 rounded-full transition duration-150 ${hoverColor ?? 'hover:bg-gray-200'}`}
                data-tooltip-id={randomId}
                onClick={handleClick}>
                <Icon className="w-5 h-5"/>
            </button>
        </>
    );
}

export default ActionButton