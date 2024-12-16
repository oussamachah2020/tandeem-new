import {FC, ReactNode, SyntheticEvent} from "react";
import {XMarkIcon} from "@heroicons/react/24/outline";

interface Props {
    title: string
    isShown: boolean
    onClose: () => void
    width?: string
    children?: ReactNode
}

export const Modal: FC<Props> = ({title, isShown, onClose, children, width}) => {
    const onClick = (e: SyntheticEvent) => {
        e.stopPropagation();
        onClose()
    }

    return (
      isShown && (
        <div
          className="fixed left-0 top-0 z-40 w-full h-full flex justify-center items-center bg-black bg-opacity-40 cursor-default pointer-events-auto"
          onClick={onClose}
        >
          <div
            className={`flex flex-col gap-5 bg-white p-6 rounded-lg shadow ${
              width ?? "w-[95%] lg:w-7/12"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-medium">{title}</h1>
              <button onClick={onClick}>
                <XMarkIcon className="w-6 h-6 text-primary" />
              </button>
            </div>
            <hr />
            <div className="max-h-[80vh] overflow-y-auto px-1">{children}</div>
          </div>
        </div>
      )
    );
}
