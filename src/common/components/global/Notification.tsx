import {FC, useEffect, useState} from "react";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import {NotificationContent, NotificationSeverity} from "@/common/utils/types";
import {useNotifications} from "@/common/context/NotificationsContext";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {useSearchParams} from "next/navigation";

interface Props {
}

const Notification: FC<Props> = () => {
    const [content, setContent] = useState<NotificationContent | null>(null);
    const [isShown, setIsShown] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const {notification} = useStaticValues()

    const [notificationKey, setNotificationKey] = useNotifications()
    useEffect(() => {
        setContent(notificationKey ? notification[notificationKey] : null)
    }, [notificationKey])

    const searchParams = useSearchParams();
    useEffect(() => {
        const notificationKey = searchParams.get('_notif')
        if (notificationKey) setContent(notification[notificationKey])
    }, [searchParams])

    useEffect(() => {
        if (isShown) {
            const t1 = setTimeout(() => setIsVisible(true), 50);
            const t2 = setTimeout(() => setIsShown(false), 6000);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            }
        } else {
            setNotificationKey(null)
            setIsVisible(false)
        }
    }, [isShown]);

    useEffect(() => {
        if (content) setIsShown(true)
        else setIsShown(false)
    }, [content])

    return (
        <div
            className={`fixed z-50 top-3.5 right-3.5 flex flex-col gap-2 left-3.5 md:left-auto md:w-1/2 lg:w-1/4 p-4 bg-white rounded-xl shadow-lg transition duration-200 border ${!isShown && 'hidden'} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className='flex gap-4'>
                <div>
                    <div className={`flex justify-center items-center h-7 w-7 rounded-lg 
                        ${content?.severity === NotificationSeverity.ERROR && 'text-red-600 bg-red-100'}
                        ${content?.severity === NotificationSeverity.SUCCESS && 'text-green-600 bg-green-100'}
                        ${content?.severity === NotificationSeverity.WARNING && 'text-amber-600 bg-amber-100'}
                        ${content?.severity === NotificationSeverity.INFORMATION && 'text-sky-600 bg-sky-100'}
                    `}>
                        {content?.severity === NotificationSeverity.ERROR && <XCircleIcon className='w-5 h-5'/>}
                        {content?.severity === NotificationSeverity.SUCCESS && <CheckCircleIcon className='w-5 h-5'/>}
                        {content?.severity === NotificationSeverity.WARNING &&
                            <ExclamationTriangleIcon className='w-5 h-5'/>}
                        {content?.severity === NotificationSeverity.INFORMATION &&
                            <InformationCircleIcon className='w-5 h-5'/>}
                    </div>
                </div>
                <div className='flex-1 flex flex-col gap-3'>
                    <div className='flex items-center h-7 text-[1rem]'>
                        {content?.severity}
                    </div>
                    <hr className='border-0 border-b'/>
                    <div className="text-gray-700 text-[.90rem]">
                        {content?.message}
                    </div>
                </div>
                <div>
                    <button className="p-2" onClick={() => setIsShown(false)}>
                        <XMarkIcon className='w-4 h-4 text-primary'/>
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Notification