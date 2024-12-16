import {FC, useState} from "react";
import {Input} from "@/common/components/atomic/Input";
import {PlusIcon} from "@heroicons/react/24/outline";
import { getAllSubCategories, getLabeledSubCategories } from "@/common/utils/functions";
import customerService from "@/domain/customers/services/CustomerService";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    customer: NonNullable<Awaited<ReturnType<typeof customerService.getOne>>>
}

export const InternalOfferCreateForm: FC<Props> = ({customer}) => {
    const {subCategory} = useStaticValues()
    const [useDiscount, setUseDiscount] = useState(true)
    return (
        <form action='/api/offers/create' method='POST' encType='multipart/form-data'>
            <div className='mb-6 flex flex-col gap-3'>
                <Input
                    name='title'
                    label='Titre'
                    placeholder="Titre"
                    icon='HashtagIcon'
                />
                <Input
                    name='description'
                    label='Description'
                    placeholder="Description"
                    icon='NewspaperIcon'
                    type='textarea'
                />
                <Input
                    name='category'
                    label="Categorie"
                    placeholder='Choisir la categorie'
                    icon='SwatchIcon'
                    type='select'
                    options={subCategory}
                />
                <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                    <Input
                        name='from'
                        label='Date de début'
                        icon='CalendarDaysIcon'
                        type='date'
                        initialValue={new Date()}
                        min={new Date(customer.contract.from)}
                    />
                    <Input
                        name='to'
                        label='Date de fin'
                        icon='CalendarDaysIcon'
                        type='date'
                        max={new Date(customer?.contract!.to)}
                    />
                </div>
                <Input
                    name='paymentDetails'
                    label='Détail de paiement'
                    placeholder='Détail de paiement'
                    icon='CreditCardIcon'
                    tooltip='Un petit paragraphe détaillant à vos bénéficiaires comment profiter de cette offre.'
                />
                <div className='grid grid-cols-3 gap-4 mt-1'>
                    <div className='border p-3 rounded-lg'>
                        <div className='flex items-center gap-2 mb-2'>
                            <input
                                type="radio"
                                id='percentage'
                                checked={useDiscount}
                                onChange={(event) => setUseDiscount(event.currentTarget.value as any)}
                            />
                            <label htmlFor="percentage">Pourcentage de réduction</label>
                        </div>
                        <Input
                            name='discount'
                            placeholder="00.0%"
                            icon='ReceiptPercentIcon'
                            type='number'
                            disabled={!useDiscount}
                            min={0}
                            max={100}
                        />
                    </div>
                    <div className='col-span-2 border p-3 rounded-lg'>
                        <div className='flex items-center gap-2 mb-2'>
                            <input
                                type="radio"
                                id='prices'
                                checked={!useDiscount}
                                onChange={(event) => setUseDiscount(!(event.currentTarget.value as any))}
                            />
                            <label htmlFor="prices">Prix Initial/Prix Final</label>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                name='initialPrice'
                                placeholder="Prix
                                Initial"
                                icon='BanknotesIcon'
                                type='number'
                                disabled={useDiscount}
                                min={0}
                            />
                            <Input
                                name='finalPrice'
                                placeholder="Prix Final"
                                icon='BanknotesIcon'
                                type='number'
                                disabled={useDiscount}
                                min={0}
                            />
                        </div>
                    </div>
                </div>
                <Input
                    name='image'
                    label="Miniature"
                    placeholder="Uploader une miniature"
                    icon='CloudArrowUpIcon'
                    type='file'
                    accept='image'
                />
            </div>
            <button
                className='w-full bg-secondary text-white flex justify-center items-center gap-4 rounded-lg py-3 hover:brightness-95 transition duration-200'>
                <PlusIcon className='w-6 h-6'/>
                Ajouter
            </button>
        </form>
    );
}