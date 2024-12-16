import {createContext, Dispatch, SetStateAction, useContext} from 'react';

const NotificationsContext = createContext<[string | null, Dispatch<SetStateAction<string | null>>]>(null as any);

export const useNotifications = () => {
    return useContext(NotificationsContext);
};

export default NotificationsContext;
