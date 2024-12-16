import {ChangeEvent, FC, SyntheticEvent, useCallback, useState} from "react";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {CubeIcon, PlusIcon} from "@heroicons/react/24/outline";
import {MinusIcon} from "@heroicons/react/20/solid";
import Button from "@/common/components/atomic/Button";

type GeneratedCouponDataItem = { key: string, value: string }

interface Props {
    jsonData?: Record<string, string>
    onSave?: (newJsonData: Record<string, string>) => void
}

export const GeneratedCouponDataForm: FC<Props> = ({jsonData, onSave}) => {
    const {label, action} = useStaticValues()
    const [data, setData] = useState(jsonData
        ? Object.entries(jsonData).map(([key, value]) => ({key, value}))
        : Array<GeneratedCouponDataItem>({key: '', value: ''}))

    const handleRemoveItem = useCallback((e: SyntheticEvent, itemIdx: number) => {
        e.preventDefault();
        setData(prevData =>
            prevData.filter((value, idx) => idx != itemIdx));
    }, []);

    const handleItemKeyChange = useCallback((e: ChangeEvent<HTMLInputElement>, itemIdx: number) => {
        setData(value =>
            value.map((item, idx) => idx === itemIdx ? {...item, key: e.target.value} : item));
    }, []);

    const handleItemValueChange = useCallback((e: ChangeEvent<HTMLInputElement>, itemIdx: number) => {
        setData(value =>
            value.map((item, idx) => idx === itemIdx ? {...item, value: e.target.value} : item));
    }, []);

    const handleAddNewItem = useCallback((e: SyntheticEvent) => {
        e.preventDefault();
        setData(prevData => [...prevData, {key: '', value: ''}]);
    }, []);

    const handleSave = useCallback((e: SyntheticEvent) => {
        e.preventDefault();
        const jsonData = data.reduce((acc, item) => ({...acc, [item.key]: item.value}), {})
        if (onSave) onSave(jsonData);
    }, [onSave, data]);

    return (
        <div className='mt-0.5 flex flex-col gap-3'>
            {data.map((item, idx) => (
                    <div className='flex items-center gap-3'>
                        {data.length > 1 && onSave && (
                            <button
                                className='flex justify-center items-center rounded-lg px-3 py-3 hover:brightness-95 transition duration-200 bg-gray-100 text-black'
                                onClick={e => handleRemoveItem(e, idx)}
                            >
                                <MinusIcon className='w-4 h-4'/>
                            </button>
                        )}
                        <div className='relative w-full h-full'>
                            <div className='absolute flex items-center inset-y-0 left-0 pl-4'>
                                <CubeIcon className='w-5 h-5 transition-colors duration-200 text-primary'/>
                            </div>
                            <input
                                className='w-full px-3.5 py-2.5 pl-12 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition duration-200 disabled:bg-gray-50'
                                type="text"
                                placeholder={label.fieldName}
                                value={item.key}
                                onChange={e => handleItemKeyChange(e, idx)}
                                disabled={!onSave}
                            />
                        </div>
                        <div className='relative w-full h-full'>
                            <div className='absolute flex items-center inset-y-0 left-0 pl-4'>
                                <CubeIcon className='w-5 h-5 transition-colors duration-200 text-primary'/>
                            </div>
                            <input
                                className='w-full px-3.5 py-2.5 pl-12 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition duration-200 disabled:bg-gray-50'
                                type="text"
                                placeholder={label.value}
                                value={item.value}
                                onChange={e => handleItemValueChange(e, idx)}
                                disabled={!onSave}
                            />
                        </div>
                    </div>
                )
            )}
            {onSave && (
                <>
                    <div>
                        <button
                            className='flex justify-center items-center rounded-lg px-3 py-3 hover:brightness-95 transition duration-200 bg-gray-100 text-black'
                            onClick={handleAddNewItem}
                        >
                            <PlusIcon className='w-4 h-4'/>
                        </button>
                    </div>
                    <Button
                        onClick={handleSave}
                        icon='CheckIcon'
                        text={action.confirm}
                    />
                </>
            )}
        </div>
    )
}