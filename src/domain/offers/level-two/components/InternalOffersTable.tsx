import {FC} from "react";
import Datatable from "@/common/components/datatable/Datatable";
import Label from "@/common/components/atomic/Label";
import {Offer, OfferStatusName} from "@prisma/client";
import OfferStatus from "@/domain/offers/shared/components/OfferStatus";
import {DatatableRow} from "@/common/components/datatable/DatatableRow";
import {DatatableValue} from "@/common/components/datatable/DatatableValue";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offers: Offer[]
    onClick: (offer: Offer) => void
    onUpdate: (offer: Offer) => void
}

const InternalOffersTable: FC<Props> = ({offers, onClick, onUpdate}) => {
    const {subCategory} = useStaticValues()
    const {confirmation} = useStaticValues()
    return (
        <Datatable headers={['Miniature', 'Titre', 'Catégorie', 'Status']} isEmpty={offers.length === 0}>
            {offers.map((offer, idx) =>
                <DatatableRow
                    key={idx}
                    onClick={() => onClick(offer)}
                    onUpdate={() => onUpdate(offer)}
                    onDelete={{
                        action: '/api/offers/delete',
                        resourceId: offer.id,
                        message: confirmation.areYouSure
                    }}
                    actionButtons={
                        <>
                            {offer.status === OfferStatusName.Active &&
                                <ConfirmableActionButton
                                    action='/api/offers/activation/deactivate'
                                    resourceId={offer.id}
                                    template={{icon: 'XMarkIcon', text: 'Désactiver'}}
                                    message='La désactivation de cette offre la rendra indisponible pour vos collaborateurs.'
                                    tooltip="Désactiver l'offre"
                                />}
                            {offer.status === OfferStatusName.Inactive &&
                                <ConfirmableActionButton
                                    action='/api/offers/activation/activate'
                                    resourceId={offer.id}
                                    template={{icon: 'CheckIcon', text: 'Activer'}}
                                    message="L'activation cette offre la rendra immédiatement disponible à tous vos collaborateurs."
                                    tooltip="Activer l'offre"
                                />}
                        </>
                    }
                >
                    <DatatableValue>
                        <ImagePreview
                            imageRef={offer.image}
                            width='w-36'
                            aspectRatio='aspect-video'
                        />
                    </DatatableValue>
                    <DatatableValue>{offer.title}</DatatableValue>
                    <DatatableValue><Label>{subCategory[offer.category]}</Label></DatatableValue>
                    <DatatableValue><OfferStatus status={offer.status}/></DatatableValue>
                </DatatableRow>
            )}
        </Datatable>
    );
}

export default InternalOffersTable