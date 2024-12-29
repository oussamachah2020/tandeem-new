import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {Modal} from "@/common/components/global/Modal";
import {AuthenticatedUser} from "@/common/services/AuthService";
import useModal from "@/common/hooks/UseModal";
import {getToken} from "next-auth/jwt";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import EmptyContent from "@/common/components/atomic/EmptyContent";
import PublicationCard from "@/domain/publications/components/PublicationCard";
import PublicationCreateForm from "@/domain/publications/components/PublicationCreateForm";
import publicationService from "@/domain/publications/services/PublicationService";
import PublicationUpdateForm from "@/domain/publications/components/PublicationUpdateForm";
import useFilter from "@/common/hooks/UseFilter";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import {ArrayElement} from "@/common/utils/types";
import { useAuthStore } from "@/zustand/auth-store";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

interface Props {
  user: AuthenticatedUser;
  publications: Awaited<ReturnType<typeof publicationService.getAll>>;
}

const Publications: NextPage<Props> = ({}) => {
  const [, isPublicationCreateModalShown, togglePublicationCreateModal] =
    useModal(false);
  const [
    publicationToUpdate,
    isPublicationUpdateModalShown,
    togglePublicationUpdateModal,
  ] = useModal<ArrayElement<typeof publications>>();
  const { authenticatedUser, accessToken } = useAuthStore();
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchResultedPublications, onSearchInputChange] = useSearch<
    ArrayElement<typeof publications>
  >(publications, ["title"]);

  const [filteredPublications, onFilterValueChange] = useFilter<
    ArrayElement<typeof publications>
  >(searchResultedPublications, ["pinned"]);

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/publications/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch customers.");
      const data = await response.json();
      console.log(data);
      setPublications(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [authenticatedUser]);

  return (
    <>
      <Main section={SectionName.Publications} user={authenticatedUser}>
        <ActionBar
          action={{
            text: "Ajouter une publication",
            onClick: () => togglePublicationCreateModal(true),
          }}
          onSearchInputChange={onSearchInputChange}
        />
        <FilterGroup>
          <Filter
            icon="BookmarkIcon"
            label="Épinglé"
            values={[
              ["true", "Oui"],
              ["false", "Non"],
            ]}
            onValueChange={(event) => onFilterValueChange("pinned", event)}
          />
        </FilterGroup>
        <div className="h-[38rem] overflow-y-auto pb-10">
          {loading ? (
            <div className="h-40 flex justify-center items-center w-full bg-white">
              <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredPublications?.length > 0 ? (
                <div className="grid overflow-y-auto grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredPublications?.map((publication, idx) => (
                    <PublicationCard
                      key={idx}
                      publication={publication}
                      onUpdate={() =>
                        togglePublicationUpdateModal(true, publication)
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyContent />
              )}
            </>
          )}
        </div>
      </Main>
      <Modal
        title="Ajouter une publication"
        isShown={isPublicationCreateModalShown}
        onClose={() => togglePublicationCreateModal(false)}
      >
        <PublicationCreateForm
          onClose={() => togglePublicationCreateModal(false)}
        />
      </Modal>
      <Modal
        title="Modifier la publication"
        isShown={isPublicationUpdateModalShown}
        onClose={() => togglePublicationUpdateModal(false)}
      >
        <PublicationUpdateForm
          onClose={() => togglePublicationUpdateModal(false)}
          publication={publicationToUpdate}
        />
      </Modal>
    </>
  );
};


export default Publications;
