import {getDownloadUrl} from "@/common/utils/functions";
import {FC} from "react";

interface Props {
    imageRef: string
    width?: string
    aspectRatio?: 'aspect-square' | 'aspect-video'
    bgStyle?: 'bg-contain' | 'bg-cover'
}

export const ImagePreview: FC<Props> = ({imageRef, width, aspectRatio, bgStyle}) =>
    <div
        className={`bg-white border rounded-xl ${bgStyle ?? 'bg-contain'} bg-no-repeat bg-center bg-origin-content -p-[1px] ${width ?? 'w-16'} ${aspectRatio ?? 'aspect-square'}`}
        style={{backgroundImage: `url(${getDownloadUrl(imageRef)})`}}
    />;
