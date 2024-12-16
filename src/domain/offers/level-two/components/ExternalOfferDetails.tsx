import {FC} from "react";
import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import {formatDate, getDownloadUrl} from "@/common/utils/functions";
import Label from "@/common/components/atomic/Label";
import {jobLevels, labeledJobLevels} from "@/common/utils/statics";
import {CheckIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {AcceptableOffer} from "@/domain/offers/level-two/models/AcceptableOffer";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offer?: AcceptableOffer
}

const ExternalOfferDetails: FC<Props> = ({offer}) => {
    const {category} = useStaticValues()
    return offer && (
        <div className='flex flex-col gap-8'>
            <div className='grid grid-cols-5 gap-8'>
                <img className='col-span-2 rounded-xl' src={getDownloadUrl(offer.image)} alt="Thumbnail"/>
                <div className='col-span-3 flex flex-col justify-between gap-8'>
                    <div className='flex flex-col gap-5'>
                        <div className="flex gap-3 items-center">
                            <ImagePreview imageRef={offer.partner.logo}/>
                            <div className="flex flex-col gap-2">
                                <div className="font-medium">{offer.partner.name}</div>
                                <div className="max-w-fit bg-gray-50 text-sm rounded px-2 py-1">
                                    {category[offer.partner.category]}
                                </div>
                            </div>
                        </div>
                        <h3 className='text-lg'>{offer.title}</h3>
                        <div className='flex items-center gap-3'>
                            {offer.discount &&
                                <Label textColor='text-secondary' textSize='text-lg' fontSize='font-medium'>
                                    -{offer.discount}%
                                </Label>}
                            {offer.initialPrice && offer.finalPrice &&
                                <div className='flex gap-4 items-center'>
                                    <Label textColor='text-primary' fontSize='font-medium'>
                                        {offer.finalPrice} MAD
                                    </Label>
                                    <span
                                        className='font-medium text-sm line-through decoration-secondary decoration-2'>
                                        {offer.initialPrice} MAD
                                    </span>
                                </div>}
                            <div className='border-l pl-3 flex items-center gap-3 text-gray-500 text-sm'>
                                <CalendarDaysIcon className='w-6 h-6'/>
                                <div>Jusqu'au {formatDate(offer.to)}</div>
                            </div>
                        </div>
                        <div className='leading-loose text-justify text-sm'>{offer.description}</div>
                        {offer.accepted && (
                            <>
                                <div className='flex items-start gap-3'>
                                    <div className='whitespace-nowrap text-sm'>
                                        Accepté pour
                                    </div>
                                    <div className='flex flex-wrap gap-2 flex-grow pl-3 border-l'>
                                        {offer.acceptedFor?.length === labeledJobLevels.length
                                            ? <Label>Tout le monde</Label>
                                            : offer.acceptedFor?.map((level, idx) => <Label
                                                key={idx}>{jobLevels[level]}</Label>)}
                                    </div>
                                </div>
                                <div className='flex gap-3'>
                                    <div className='whitespace-nowrap text-sm'>
                                        Épinglé
                                    </div>
                                    <div className='w-5 h-5 text-primary'>
                                        {offer.pinned ? <CheckIcon/> : <XMarkIcon/>}
                                    </div>
                                </div>
                            </>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExternalOfferDetails