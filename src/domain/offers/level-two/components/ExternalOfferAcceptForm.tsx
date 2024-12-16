import {FC, useEffect, useState} from "react";
import Button from "@/common/components/atomic/Button";
import {JobLevel} from "@prisma/client";
import {labeledJobLevels} from "@/common/utils/statics";
import {AcceptableOffer} from "@/domain/offers/level-two/models/AcceptableOffer";

interface Props {
    offer: AcceptableOffer
}

export const ExternalOfferAcceptForm: FC<Props> = ({offer}) => {
    const [isInputValid, setIsInputValid] = useState(true)
    const [checkedTrack, setCheckedTrack] = useState(
        offer.acceptedFor === undefined
            ? labeledJobLevels.map(() => true)
            : labeledJobLevels.map(([key]) => offer.acceptedFor!.includes(key as JobLevel))
    )
    useEffect(() => {
        if (checkedTrack.every((value) => !value)) setIsInputValid(false)
        else setIsInputValid(true)
    }, [checkedTrack])

    return (
        <form action='/api/offers/accept' method='POST'>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-4'>
                    <div className='font-medium'>
                        Accepter pour
                    </div>
                    <div className='flex-grow px-5 flex flex-col gap-3'>
                        {labeledJobLevels.map(([key, value], idx) => (
                            <div key={idx} className='flex items-center gap-3'>
                                <input
                                    id={key}
                                    type="checkbox"
                                    name='levels'
                                    value={key}
                                    className='w-3.5 h-3.5 text-primary bg-gray-50 rounded-xl focus:ring-blue-500'
                                    defaultChecked={checkedTrack[idx]}
                                    onChange={event =>
                                        setCheckedTrack(state => state.map((value, innerIdx) => innerIdx === idx ? event.target.checked : value))
                                    }
                                />
                                <label htmlFor={key}>{value}</label>
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-3 items-center'>
                        <input
                            id='pin'
                            type="checkbox"
                            name='pinned'
                            className='w-3.5 h-3.5 text-primary bg-gray-50 rounded-xl focus:ring-blue-500'
                            defaultChecked={offer.pinned}
                        />
                        <label className='font-medium' htmlFor='pin'>Marquer comme épinglé</label>
                    </div>
                </div>
                <Button fullWidth icon='CheckIcon' text='Confirmer' disabled={!isInputValid}/>
            </div>
            <input name='offerId' value={offer.id} className='hidden'/>
        </form>
    );
}

