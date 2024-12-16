import {FC, ReactNode} from "react";

interface Props {
    title: string
    classname?: string
    children?: ReactNode
}

const DetailsRow: FC<Props> = ({title, classname, children}) => (
    <tr>
        <th className='text-sm w-[1%] whitespace-nowrap p-2.5 pl-0'>{title}</th>
        <td className={`p-2.5 ${classname ?? ''}`}>
            {children}
        </td>
    </tr>
)

export default DetailsRow