import {FC, ReactNode} from "react";

interface Props {
    title: string
    children?: ReactNode
}

const DetailsSection: FC<Props> = ({title, children}) => (
    <>
        <tr>
            <th colSpan={2} className='p-0 pb-1'>
                <h3 className='text-xl font-medium'>{title}</h3>
            </th>
        </tr>
        {children}
        <tr>
            <td className='py-3'></td>
        </tr>
    </>
)

export default DetailsSection