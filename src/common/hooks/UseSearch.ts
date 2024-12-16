import {ChangeEvent, useEffect, useState} from "react";

const useSearch = <T>(data: T[], fields: Array<keyof T>): [T[], (event: ChangeEvent<HTMLInputElement>) => void] => {
    const [filteredData, setFilteredData] = useState(data)

    useEffect(() => {
        setFilteredData(data)
    }, [data])

    const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const newVal = value === ''
            ? data
            : data.filter((item) => {
                for (const field of fields) {
                    const val = (field as string).includes('.')
                        ? (field as string).split('.').reduce((prev, curr) => prev && prev[curr as keyof typeof prev] as any, item)
                        : item[field]
                    if (val && String(val).toLowerCase().indexOf(value.toLowerCase()) !== -1)
                        return true
                }
                return false
            })
        setFilteredData(newVal)
    }

    return [filteredData, onSearchInputChange]
};

export default useSearch