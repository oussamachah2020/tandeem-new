import {FC} from "react";

interface Props {
    href?: string
}

const ContractPreview: FC<Props> = ({href}) =>
    href ? <embed src={href} className='w-full h-[720px]' type="application/pdf"/> : <></>

export default ContractPreview