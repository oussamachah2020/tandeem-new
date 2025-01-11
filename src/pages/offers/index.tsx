import { Main } from "@/common/components/global/Main";
import { SectionName } from "@/common/security/Sections";
import { ChangeEvent, useEffect, useState } from "react";
import useSearch from "@/common/hooks/UseSearch";
import useFilter from "@/common/hooks/UseFilter";
import ActionBar from "@/common/components/global/ActionBar";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import OfferTable from "@/domain/offers/level-one/components/OfferTable";
import { Modal } from "@/common/components/global/Modal";
import { OfferCreateForm } from "@/domain/offers/level-one/components/OfferCreateForm";
import OfferDetails from "@/domain/offers/level-one/components/OfferDetails";
import useModal from "@/common/hooks/UseModal";
import offerService from "@/domain/offers/shared/services/OfferService";
import { labeledOfferStatuses } from "@/common/utils/statics";
import OfferUpdateForm from "@/domain/offers/level-one/components/OfferUpdateForm";
import { ArrayElement } from "@/common/utils/types";
import { getRoleLevel } from "@/common/utils/functions";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/auth-store";
import { RefreshCcw } from "lucide-react";

type Partner = Awaited<ReturnType<typeof partnerService.getAll>>;
type Offer = ArrayElement<
  Awaited<ReturnType<typeof offerService.getAllForLevel1>>
>;

const Offers = () => {
  const [, isAddOfferModalShown, toggleAddOfferModal] = useModal(false);
  const [offerToShow, isOfferModalShown, toggleOfferModal] = useModal<Offer>();
  const [offerToUpdate, isOfferUpdateModalShown, toggleOfferUpdateModal] =
    useModal<Offer>();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const [searchResultedOffers, onSearchInputChange] = useSearch(offers, [
    "title",
  ]);
  const [filteredOffers, onFilterValueChange] = useFilter(
    searchResultedOffers,
    ["partner.id" as any, "status"],
  );
  const { authenticatedUser, accessToken } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/partners/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) console.error("Failed to fetch customers.");
      const data = await response.json();
      setPartners(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/offers/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) console.error("Failed to fetch customers.");
      const data = await response.json();
      setOffers(data.offers);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchOffers();
  }, [accessToken]);

  useEffect(() => {
    if (authenticatedUser) {
      if (getRoleLevel(authenticatedUser?.role) === 2)
        return router.replace("/offers/customer");
    }
  }, [authenticatedUser]);

  return (
    <>
      <Main section={SectionName.Offers} user={authenticatedUser}>
        <ActionBar
          action={{
            text: "Ajouter une offre",
            onClick: () => toggleAddOfferModal(true),
          }}
          onSearchInputChange={onSearchInputChange}
        />
        <FilterGroup>
          <Filter
            label="Partenaire"
            icon="BriefcaseIcon"
            values={[]?.map(({ id, name }) => [id, name])}
            onValueChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterValueChange("partner.id" as any, e)
            }
          />
          <Filter
            label="Status"
            icon="ArrowPathIcon"
            values={labeledOfferStatuses}
            onValueChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterValueChange("status", e)
            }
          />
        </FilterGroup>
        {loading ? (
          <div className="h-40 flex justify-center items-center w-full bg-white">
            <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <OfferTable
            offers={filteredOffers}
            onClick={(offer: any) => toggleOfferModal(true, offer)}
            onUpdate={(offer: any) => toggleOfferUpdateModal(true, offer)}
          />
        )}
      </Main>
      <Modal
        title="Ajouter une offre"
        isShown={isAddOfferModalShown}
        onClose={() => toggleAddOfferModal(false)}
        width=""
      >
        <OfferCreateForm
          partners={partners}
          onClose={() => toggleAddOfferModal(false)}
        />
      </Modal>
      <Modal
        title="Détails de l'offre"
        isShown={isOfferModalShown}
        onClose={() => toggleOfferModal(false)}
      >
        <OfferDetails offer={offerToShow} />
      </Modal>
      <Modal
        title="Modifier l'offre"
        isShown={isOfferUpdateModalShown}
        onClose={() => toggleOfferUpdateModal(false)}
        width=""
      >
        <OfferUpdateForm offer={offerToUpdate} />
      </Modal>
    </>
  );
};

export default Offers;
