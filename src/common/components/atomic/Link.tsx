import {CSSProperties, FC, ReactNode, SyntheticEvent, useState} from "react";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import NextLink from 'next/link'

interface Props {
    href: string
    className?: string
    internal?: boolean
    styled?: boolean
    style?: CSSProperties
    children?: ReactNode
    onClick?: () => Promise<void> | void
}

const Link: FC<Props> = ({href, internal, styled, className, style, children, onClick}) => {
    const [loading, setLoading] = useState(false)
    const handleClick = async (e: SyntheticEvent) => {
        e.stopPropagation()
        if (internal && href !== '#') setLoading(true)
        if (onClick) await onClick()
        return false
    }
    return (
        <>
            <NextLink
                style={style}
                href={href}
                onClick={handleClick}
                className={`${className} ${(styled || styled === undefined) && ' text-gray-700 underline underline-offset-[3.5px] decoration-2 decoration-neutral-400 hover:decoration-secondary hover:text-black transition duration-200'}`}
                target={internal ? undefined : '_blank'}
            >
                {children}
            </NextLink>
            {loading &&
                <div
                    className='fixed left-0 top-0 z-50 w-full h-full flex justify-center items-center bg-black bg-opacity-40'>
                    <ArrowPathIcon className='text-white w-10 h-10 animate-spin'/>
                </div>}
        </>

    );
}

export default Link