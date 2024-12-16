import {FC} from "react";
import {Input} from "@/common/components/atomic/Input";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {getLabeledSubCategories, toHtmlDate} from "@/common/utils/functions";
import {EitherInput} from "@/common/components/atomic/EitherInput";
import {OfferUpdateDto, OfferUpdateFilesDto} from "@/domain/offers/shared/dtos/OfferUpdateDto";
import customerService from "@/domain/customers/services/CustomerService";
import {NAPaymentDetails} from "@/domain/offers/shared/dtos/OfferCreateDto";
import {Offer} from "@prisma/client";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    customer: NonNullable<Awaited<ReturnType<typeof customerService.getOne>>>
    offer: Offer
}

type T = OfferUpdateDto & OfferUpdateFilesDto

export const InternalOfferUpdateForm: FC<Props> = ({customer, offer}) => {
    const {subCategory} = useStaticValues()
    return <form action='/api/offers/update' method='POST' encType='multipart/form-data'>
        <input
            value={offer.id}
            name='offerId'
            className='hidden'
            type="text"
        />
        <input
            value={offer.image}
            name='imageRef'
            className='hidden'
            type="text"
        />
        <div className='mb-6 flex flex-col gap-3'>
            <Input<T>
                name='title'
                label='Titre'
                placeholder="Titre"
                icon='HashtagIcon'
                initialValue={offer.title}
            />
            <Input<T>
                name='description'
                label='Description'
                placeholder="Description"
                icon='NewspaperIcon'
                type='textarea'
                initialValue={offer.description}
            />
            <Input<T>
                name='category'
                label="Categorie"
                placeholder='Choisir la categorie'
                icon='SwatchIcon'
                type='select'
                options={subCategory}
                selected={offer.category}
            />
            <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                <Input<T>
                    name='from'
                    label='Date de début'
                    icon='CalendarDaysIcon'
                    type='date'
                    initialValue={toHtmlDate(offer.from)}
                    min={toHtmlDate(customer.contract.from)}
                />
                <Input<T>
                    name='to'
                    label='Date de fin'
                    icon='CalendarDaysIcon'
                    type='date'
                    initialValue={toHtmlDate(offer.to)}
                    max={toHtmlDate(customer.contract.to)}
                />
            </div>
            <EitherInput
                initialActiveSide={offer.discount ? 'left' : 'right'}
                className='grid-cols-3'
                colSpans={['col-span-1', 'col-span-2']}
                labels={['Pourcentage de réduction', 'Prix Initial/Prix Final']}
                nodes={[
                    <Input<T>
                        name='discount'
                        placeholder="00.0"
                        icon='ReceiptPercentIcon'
                        type='number'
                        initialValue={offer.discount}
                        min={0}
                        max={100}
                    />,
                    <div className='grid grid-cols-2 gap-4'>
                        <Input<T>
                            name='initialPrice'
                            placeholder="Prix Initial"
                            icon='BanknotesIcon'
                            type='number'
                            initialValue={offer.initialPrice}
                            min={0}
                        />
                        <Input<T>
                            name='finalPrice'
                            placeholder="Prix Final"
                            icon='BanknotesIcon'
                            type='number'
                            initialValue={offer.finalPrice}
                            min={0}
                        />
                    </div>
                ]}
            />
            <Input<T>
                name='paymentDetails'
                label='Détail de paiement'
                placeholder='Détail de paiement'
                icon='CreditCardIcon'
                tooltip='Un petit paragraphe détaillant à vos bénéficiaires comment profiter de cette offre.'
                initialValue={(offer.paymentDetails as any as NAPaymentDetails).description}
            />
            <Input<T>
                name='image'
                label="Miniature"
                placeholder="Uploader une miniature"
                icon='CloudArrowUpIcon'
                type='file'
                accept='image'
                required={false}
            />
        </div>
        <button
            className='w-full bg-secondary text-white flex justify-center items-center gap-4 rounded-lg py-3 hover:brightness-95 transition duration-200'>
            <PencilSquareIcon className='w-6 h-6'/>
            Modifier
        </button>
    </form>;
}

export default InternalOfferUpdateForm