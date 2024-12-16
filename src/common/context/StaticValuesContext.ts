import {createContext, useContext} from 'react';
import staticValues from './StaticValues';

const StaticValuesContext = createContext(staticValues);

export const useStaticValues = () => {
    return useContext(StaticValuesContext);
};

export default StaticValuesContext;
