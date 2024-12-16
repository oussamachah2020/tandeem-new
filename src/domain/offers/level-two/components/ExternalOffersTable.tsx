import {FC} from "react";
import Datatable from "@/common/components/datatable/Datatable";
import Label from "@/common/components/atomic/Label";
import {DatatableRow} from "@/common/components/datatable/DatatableRow";
import {DatatableValue} from "@/common/components/datatable/DatatableValue";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import {AcceptableOffer} from "@/domain/offers/level-two/models/AcceptableOffer";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import ActionButton from "@/common/components/atomic/ActionButton";
import {CheckIcon, MinusIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offers: AcceptableOffer[]
    onClick: (offer: AcceptableOffer) => void
    onAccept: (offer: AcceptableOffer) => void
    onUpdate: (offer: AcceptableOffer) => void
}

const ExternalOffersTable: FC<Props> = ({offers, onClick, onAccept, onUpdate}) => {
    const {category, subCategory} = useStaticValues()
    return <Datatable
        isEmpty={offers.length === 0}
        headers={['Prestataire', 'Titre', 'Catégorie', 'Sous-Catégorie', 'Status', 'Épinglé']}
    >
        {offers.map((offer, idx) =>
            <DatatableRow
                key={idx}
                onClick={() => onClick(offer)}
                onUpdate={offer.accepted ? (() => onUpdate(offer)) : undefined}
                actionButtons={
                    offer.accepted
                        ? <ConfirmableActionButton
                            action='/api/offers/unaccept'
                            resourceId={offer.id}
                            message='Si vous dés-accepter cette offre, elle ne sera plus disponible pour vos collaborateurs.'
                            template={{icon: 'XMarkIcon', text: 'Dés-accepter'}}
                            tooltip="Dés-accepter l'offre"
                        />
                        : <ActionButton
                            icon='CheckIcon'
                            onClick={() => onAccept(offer)}
                            tooltip="Accepter l'offre"
                        />
                }
            >
                <DatatableValue><ImagePreview imageRef={offer.partner.logo}/></DatatableValue>
                <DatatableValue>{offer.title}</DatatableValue>
                <DatatableValue><Label>{category[offer.partner.category]}</Label></DatatableValue>
                <DatatableValue><Label>{subCategory[offer.category]}</Label></DatatableValue>
                <DatatableValue>{offer.accepted
                    ? <Label textColor='text-green-500'>Accepté</Label>
                    : <Label textColor='text-primary'>À accepter</Label>}
                </DatatableValue>
                <DatatableValue>{offer.accepted
                    ? offer.pinned
                        ? <CheckIcon className='text-primary w-5 h-5'/>
                        : <XMarkIcon className='text-primary w-5 h-5'/>
                    : <MinusIcon className='text-primary w-5 h-5'/>}
                </DatatableValue>
            </DatatableRow>
        )}
    </Datatable>;
}

export default ExternalOffersTable