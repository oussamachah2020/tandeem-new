import {FC, ReactNode} from "react";

interface Props {
    children?: ReactNode
    className?: string
}

const DetailsTable: FC<Props> = ({className, children}) =>
    <table className={`text-left ${className ?? ''}`}>
        <tbody>
        {children}
        </tbody>
    </table>

export default DetailsTable