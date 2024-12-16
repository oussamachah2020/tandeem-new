import {FC, useEffect, useState} from "react";
import {Contract, Customer, Partner} from "@prisma/client";
import {getDownloadUrl} from "@/common/utils/functions";
import {Input} from "@/common/components/atomic/Input";
import Form from "@/common/components/global/Form";

interface Props {
    contract: Contract
    contractor: Partner | Customer
}

const ContractUpdateForm: FC<Props> = ({contract, contractor}) => {
    const [isPrematureToDefined, setIsPrematureToDefined] = useState(false)
    useEffect(() => setIsPrematureToDefined(contract?.prematureTo !== null), [contract])

    return (
        <Form
            action='/api/contracts/update'
            template='UPDATE'
            multipart
        >
            <Input initialValue={contract.id} name='id' className='hidden'/>
            <Input initialValue={contract.scan} name='scanRef' className='hidden'/>
            <div className='flex flex-col gap-8'>
                <div className='flex gap-8 bg-white rounded-lg'>
                    <div>
                        <img
                            src={getDownloadUrl(contractor.logo)}
                            alt={`${contractor.name} Logo`}
                            className='w-36 p-2 rounded-xl border object-contain aspect-square'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-5 w-full'>
                        <Input
                            icon='DocumentTextIcon'
                            name='scan'
                            label="Scan"
                            placeholder="Uploader le Scan"
                            type='file'
                            accept='doc'
                            required={false}
                        />
                        <Input
                            icon='CalendarDaysIcon'
                            name='from'
                            label='Date de début'
                            type='date'
                            initialValue={new Date(contract.from)}
                        />
                        <Input
                            icon='CalendarDaysIcon'
                            name='to'
                            label="Date de fin"
                            type='date'
                            initialValue={new Date(contract.to)}
                            min={contract.prematureTo ? new Date(contract.prematureTo) : undefined}
                        />
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <input
                                    id='prematureTo'
                                    type="checkbox"
                                    className='w-3.5 h-3.5 text-primary bg-gray-50 rounded-xl focus:ring-blue-500'
                                    checked={isPrematureToDefined}
                                    defaultChecked={isPrematureToDefined}
                                    onChange={(event) => setIsPrematureToDefined(event.currentTarget.checked)}
                                />
                                <label
                                    htmlFor="prematureTo"
                                    className={!isPrematureToDefined ? 'text-gray-500' : ''}
                                >
                                    Date de résiliation prématurée
                                </label>
                            </div>
                            <Input
                                disabled={!isPrematureToDefined}
                                required={true}
                                icon='CalendarDaysIcon'
                                name='prematureTo'
                                type='date'
                                initialValue={contract.prematureTo ? new Date(contract.prematureTo) : undefined}
                                max={new Date(contract.to)}
                                min={new Date()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default ContractUpdateForm