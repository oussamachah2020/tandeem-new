import {FC} from "react";
import OfferStatus from "@/domain/offers/shared/components/OfferStatus";
import {formatDate, getDownloadUrl} from "@/common/utils/functions";
import Label from "@/common/components/atomic/Label";
import {ArrowRightIcon} from "@heroicons/react/24/outline";
import {Offer} from "@prisma/client";
import {NAPaymentDetails} from "@/domain/offers/shared/dtos/OfferCreateDto";
import DetailsTable from "@/common/components/details-table/DetailsTable";
import DetailsRow from "@/common/components/details-table/DetailsRow";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offer?: Offer
}

const InternalOfferDetails: FC<Props> = ({offer}) => {
    const {subCategory} = useStaticValues()
    return offer && (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-5 gap-8'>
                <img className='col-span-2 rounded-xl' src={getDownloadUrl(offer.image)} alt="Thumbnail"/>
                <DetailsTable className='col-span-3'>
                    <DetailsRow title='Titre'>{offer.title}</DetailsRow>
                    <DetailsRow title='Description'
                                classname='leading-loose text-justify'>{offer.description}</DetailsRow>
                    <DetailsRow title='Catégorie'><Label>{subCategory[offer.category]}</Label></DetailsRow>
                    <DetailsRow title='Status'><OfferStatus status={offer.status}/></DetailsRow>
                    <DetailsRow title='Validité' classname='flex gap-3 items-center '>
                        {formatDate(offer.from)}
                        <ArrowRightIcon className='w-4 h-4'/>
                        {formatDate(offer.to)}
                    </DetailsRow>
                    <DetailsRow title='Paiement'>
                        <q className='text-sm'>{(offer.paymentDetails as any as NAPaymentDetails).description}</q>
                    </DetailsRow>
                    {offer.discount && <DetailsRow title='Taux de réduction'>{offer.discount}%</DetailsRow>}
                    {offer.initialPrice && offer.finalPrice &&
                        <DetailsRow title='Prix' classname='flex gap-4 items-center'>
                            <Label fontSize='font-medium' textColor='text-primary'>{offer.finalPrice} MAD</Label>
                            <span
                                className='font-medium text-sm line-through decoration-secondary decoration-2'>{offer.initialPrice} MAD</span>
                        </DetailsRow>}
                </DetailsTable>
            </div>
        </div>

    );
}

export default InternalOfferDetails