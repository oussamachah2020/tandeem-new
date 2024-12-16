import ActionBar from "@/common/components/global/ActionBar";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import {FC} from "react";
import useSearch from "@/common/hooks/UseSearch";
import useFilter from "@/common/hooks/UseFilter";
import useModal from "@/common/hooks/UseModal";
import {Modal} from "@/common/components/global/Modal";
import {InternalOfferCreateForm} from "@/domain/offers/level-two/components/InternalOfferCreateForm";
import {Offer} from "@prisma/client";
import customerService from "@/domain/customers/services/CustomerService";
import InternalOffersTable from "@/domain/offers/level-two/components/InternalOffersTable";
import InternalOfferDetails from "@/domain/offers/level-two/components/InternalOfferDetails";
import { getAllSubCategories } from "@/common/utils/functions";
import InternalOfferUpdateForm from "@/domain/offers/level-two/components/InternalOfferUpdateForm";
import {labeledOfferStatuses} from "@/common/utils/statics";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    customer: NonNullable<Awaited<ReturnType<typeof customerService.getOne>>>
}

export const InternalOffers: FC<Props> = ({customer}) => {
    const {subCategory} = useStaticValues()
    const [searchResultedOffers, onSearchInputChange] = useSearch(customer.offers, ['title'])
    const [filteredOffers, onFilterValueChange] = useFilter(searchResultedOffers, ['category', 'status'])

    const [, isOfferCreateModalShown, toggleOfferCreateModal] = useModal(false)
    const [offerToShow, isOfferModalShown, toggleOfferModal] = useModal<Offer>()
    const [offerToUpdate, isOfferUpdateModalShown, toggleOfferUpdateModal] = useModal<Offer>()

    return (
        <>
            <ActionBar action={{text: 'Ajouter une offre', onClick: () => toggleOfferCreateModal(true)}}
                       onSearchInputChange={onSearchInputChange}/>
            <FilterGroup>
                <Filter
                    label='Catégorie'
                    icon='SwatchIcon'
                    values={getAllSubCategories(subCategory)}
                    onValueChange={(e) => onFilterValueChange('category', e)}
                />
                <Filter
                    label='Status'
                    icon='ArrowPathIcon'
                    values={labeledOfferStatuses.slice(0, 2)}
                    onValueChange={(e) => onFilterValueChange('status', e)}
                />
            </FilterGroup>
            <InternalOffersTable
                offers={filteredOffers}
                onClick={(offer: Offer) => toggleOfferModal(true, offer)}
                onUpdate={(offer: Offer) => toggleOfferUpdateModal(true, offer)}
            />
            <Modal title='Ajouter une offre' isShown={isOfferCreateModalShown}
                   onClose={() => toggleOfferCreateModal(false)}>
                <InternalOfferCreateForm customer={customer}/>
            </Modal>
            <Modal title="Modifer l'offre" isShown={isOfferUpdateModalShown}
                   onClose={() => toggleOfferUpdateModal(false)}>
                <InternalOfferUpdateForm customer={customer} offer={offerToUpdate}/>
            </Modal>
            <Modal title="Détails de l'offre" isShown={isOfferModalShown} onClose={() => toggleOfferModal(false)}>
                <InternalOfferDetails offer={offerToShow}/>
            </Modal>
        </>
    )
}