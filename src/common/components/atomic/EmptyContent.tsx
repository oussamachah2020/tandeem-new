import {InformationCircleIcon} from "@heroicons/react/24/outline";

const EmptyContent = () =>
    <div
        className="flex flex-col justify-center items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 text-center p-5">
        <InformationCircleIcon className="w-10 h-10"/>
        Pas de contenu
    </div>

export default EmptyContent