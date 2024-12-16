import ActionBar from "@/common/components/global/ActionBar";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import {ChangeEvent, FC, useMemo} from "react";
import {labeledAcceptableOfferStatuses} from "@/common/utils/statics";
import ExternalOffersTable from "@/domain/offers/level-two/components/ExternalOffersTable";
import {Modal} from "@/common/components/global/Modal";
import ExternalOfferDetails from "@/domain/offers/level-two/components/ExternalOfferDetails";
import {ExternalOfferAcceptForm} from "@/domain/offers/level-two/components/ExternalOfferAcceptForm";
import useSearch from "@/common/hooks/UseSearch";
import useFilter from "@/common/hooks/UseFilter";
import {arrayUniqueByKey} from "@/common/utils/functions";
import useModal from "@/common/hooks/UseModal";
import {AcceptableOffer} from "@/domain/offers/level-two/models/AcceptableOffer";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offers: AcceptableOffer[]
}

export const ExternalOffers: FC<Props> = ({offers}) => {
    const {category} = useStaticValues()
    const partners = useMemo(() => arrayUniqueByKey(offers.map(offer => offer.partner), 'id'), [offers])

    const [offerToShow, isOfferModalShown, toggleOfferModal] = useModal<AcceptableOffer>()
    const [offerToAccept, isAcceptOfferModalShown, toggleAcceptOfferModal] = useModal<AcceptableOffer>()

    const [searchResultedOffers, onSearchInputChange] = useSearch(offers, ['title'])
    const [filteredOffers, onFilterValueChange] = useFilter(searchResultedOffers, ['partner.id' as any, 'partner.category' as any, 'accepted', 'pinned'])

    return (
        <>
            <ActionBar onSearchInputChange={onSearchInputChange}/>
            <FilterGroup>
                <Filter
                    label='Prestataire'
                    icon='BuildingOfficeIcon'
                    values={partners.map(({id, name}) => [id, name])}
                    onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('partner.id' as any, e)}
                />
                <Filter
                    label='Catégorie'
                    icon='SwatchIcon'
                    values={Object.entries(category)}
                    onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('partner.category' as any, e)}
                />
                <Filter
                    label='Status'
                    icon='ArrowPathIcon'
                    values={labeledAcceptableOfferStatuses}
                    onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('accepted', e)}
                />
                <Filter
                    label='Épinglé'
                    icon='PaperClipIcon'
                    values={[['true', 'Oui'], ['false', 'Non']]}
                    onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('pinned', e)}
                />
            </FilterGroup>
            <ExternalOffersTable
                offers={filteredOffers}
                onClick={(offer: AcceptableOffer) => toggleOfferModal(true, offer)}
                onAccept={(offer: AcceptableOffer) => toggleAcceptOfferModal(true, offer)}
                onUpdate={(offer: AcceptableOffer) => toggleAcceptOfferModal(true, offer)}
            />
            <Modal
                title="Détails de l'offre"
                isShown={isOfferModalShown}
                onClose={() => toggleOfferModal(false)}
            >
                <ExternalOfferDetails offer={offerToShow}/>
            </Modal>
            <Modal
                title="Accepter l'offre"
                isShown={isAcceptOfferModalShown}
                onClose={() => toggleAcceptOfferModal(false)}
                width='w-4/12'
            >
                <ExternalOfferAcceptForm offer={offerToAccept}/>
            </Modal>
        </>
    )
}