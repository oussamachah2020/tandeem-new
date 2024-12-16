import {FC, ReactNode, useEffect, useRef} from "react";

interface Props {
    children?: ReactNode,
    isShown: boolean,
    close: () => void
}

export const Dropdown: FC<Props> = ({children, isShown, close}) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                close();
            }
        }
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [close]);
    return (
        <div
            ref={ref}
            className={`absolute right-0 top-full z-50 bg-white rounded-lg border w-52 mt-2 shadow ${!isShown && 'hidden'}`}
        >
            <ul className="text-sm">
                {children}
            </ul>
        </div>
    )
}