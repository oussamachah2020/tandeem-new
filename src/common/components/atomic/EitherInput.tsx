import {FC, ReactNode, useMemo, useState} from "react";
import {md5Hash} from "@/common/utils/functions";

interface Props {
    labels: [string, string],
    nodes: [ReactNode, ReactNode],
    initialActiveSide?: 'left' | 'right',
    unselectableSide?: 'left' | 'right'
    className?: string,
    gridOptions?: string
    colSpans?: [string, string]
}

export const EitherInput: FC<Props> = ({initialActiveSide, unselectableSide, className, gridOptions, labels, nodes, colSpans}) => {
    const leftId = useMemo(() => md5Hash(labels[0]), [])
    const rightId = useMemo(() => md5Hash(labels[1]), [])

    const [activeSide, setActiveSide] = useState<'left' | 'right'>(initialActiveSide ?? 'left')

    return (
        <div className={`grid gap-4 ${className} ${gridOptions ?? 'grid-cols-2'} mt-1`}>
            <div className={`border p-3 rounded-lg ${colSpans?.at(0) ?? ''} ${activeSide === 'right' && 'bg-gray-50'}`}>
                <div className='flex items-center gap-2 mb-2'>
                    <input
                        id={leftId}
                        checked={activeSide === 'left'}
                        disabled={unselectableSide === 'left'}
                        type="radio"
                        onChange={({currentTarget: {checked}}) => checked && setActiveSide('left')}
                    />
                    <label className={`${activeSide === 'right' && 'text-gray-400'} text-sm`}
                           htmlFor={leftId}>{labels[0]}</label>
                </div>
                <fieldset disabled={activeSide === 'right'}>
                    {nodes[0]}
                </fieldset>
            </div>
            <div className={`border p-3 rounded-lg ${colSpans?.at(1) ?? ''} ${activeSide === 'left' && 'bg-gray-50'}`}>
                <div className='flex items-center gap-2 mb-2'>
                    <input
                        id={rightId}
                        checked={activeSide === 'right'}
                        disabled={unselectableSide === 'right'}
                        type="radio"
                        onChange={({currentTarget: {checked}}) => checked && setActiveSide('right')}
                    />
                    <label className={`${activeSide === 'left' && 'text-gray-400'} text-sm`}
                           htmlFor={rightId}>{labels[1]}</label>
                </div>
                <fieldset disabled={activeSide === 'left'}>
                    {nodes[1]}
                </fieldset>
            </div>
        </div>
    )
}