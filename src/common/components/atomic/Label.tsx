import {FC, ReactNode} from "react";

interface Props {
    textColor?: string
    textSize?: string
    fontSize?: string
    children?: ReactNode
}

const Label: FC<Props> = ({textColor, textSize, fontSize, children}) =>
    <span
        className={`rounded-lg border px-1.5 py-0.5 bg-white whitespace-nowrap ${textColor} ${textSize ?? 'text-sm'} ${fontSize ?? ''}`}>
        {children}
    </span>

export default Label