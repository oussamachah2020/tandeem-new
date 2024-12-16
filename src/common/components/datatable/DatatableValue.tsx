import {FC, ReactNode} from "react";

interface Props {
    className?: string
    children?: ReactNode
}

export const DatatableValue: FC<Props> = ({className, children}) => <div className={className}>{children}</div>;
