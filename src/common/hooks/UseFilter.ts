import {ChangeEvent, useEffect, useState} from "react";

interface Filter<T> {
    field: keyof T,
    value: string
}

const useFilter = <T>(data: T[], fields: Array<keyof T>): [T[], (field: keyof T, event: ChangeEvent<any>) => void] => {
    const [_filters, setFilters] = useState<Filter<T>[]>(fields.map((field) => ({field, value: ''})))
    const [filteredData, setFilteredData] = useState(data)

    useEffect(() => {
        if (_filters.some(({value}) => value))
            setFilteredData(_ => {
                let _data = [...data]
                for (const {field, value} of _filters) {
                    if (value)
                        _data = _data.filter(obj => {
                            const val = (field as string).includes('.')
                                ? (field as string).split('.').reduce((prev, curr) => prev[curr as keyof typeof prev] as any, obj)
                                : obj[field]
                            // console.log(`${String(val)} === ${value} = ${String(val) === value}`)
                            return String(val) === value
                        })
                }
                return _data
            })
        else setFilteredData(data)
    }, [_filters, data])

    const onFilterValueChange = (field: keyof T, event: ChangeEvent<any>) => {
        const value = event.target.value
        setFilters(filters =>
            filters.map((filter) => filter.field === field ? {field, value} : filter))
    }

    return [filteredData, onFilterValueChange]
};

export default useFilter