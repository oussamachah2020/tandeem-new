import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {getToken} from "next-auth/jwt";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import useModal from "@/common/hooks/UseModal";
import {Modal} from "@/common/components/global/Modal";
import {ArrayElement} from "@/common/utils/types";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";
import MediaLibraryTable from "@/domain/media-library/components/MediaLibraryTable";
import MediaForm from "@/domain/media-library/components/MediaForm";
import {getRoleLevel} from "@/common/utils/functions";
import Tab from "@/common/components/global/Tab";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";

interface Props {
  tandeemMediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>;
  customerMediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>;
}

const MediaLibrary = ({ tandeemMediaLibrary, customerMediaLibrary }: Props) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [searchResultedTandeemMediaLibrary, onTandeemSearchInputChange] =
    useSearch(tandeemMediaLibrary, ["title", "description"]);
  const [searchResultedCustomerMediaLibrary, onCustomerSearchInputChange] =
    useSearch(tandeemMediaLibrary, ["title", "description"]);
  const [, isAddMediaModalShown, toggleAddMediaModal] = useModal(false);
  const [mediaToUpdate, isUpdateMediaModalShown, toggleUpdateMediaModal] =
    useModal<ArrayElement<typeof tandeemMediaLibrary>>();

  const { authenticatedUser } = useAuthStore();

  return (
    <Main section={SectionName.MediaLibrary} user={authenticatedUser}>
      <Tab
        tabs={[
          {
            icon: "RectangleStackIcon",
            text: "Médiathèque de tandeem",
            onClick: () => setSelectedTab(0),
          },
          {
            icon: "RectangleStackIcon",
            text: "Ma médiathèque",
            onClick: () => setSelectedTab(1),
          },
        ]}
        selectedTabIndex={selectedTab}
      >
        <div className={selectedTab === 0 ? "" : "hidden"}>
          <ActionBar onSearchInputChange={onTandeemSearchInputChange} />
          <MediaLibraryTable
            mediaLibrary={searchResultedTandeemMediaLibrary}
            canDelete={false}
          />
        </div>
        <div className={selectedTab === 1 ? "" : "hidden"}>
          <ActionBar
            onSearchInputChange={onCustomerSearchInputChange}
            action={{
              text: "Ajouter un média",
              onClick: () => toggleAddMediaModal(true),
            }}
          />
          <MediaLibraryTable
            mediaLibrary={searchResultedCustomerMediaLibrary}
            onUpdate={(media) => toggleUpdateMediaModal(true, media)}
          />
        </div>
      </Tab>
      <Modal
        title="Ajouter un média"
        isShown={isAddMediaModalShown}
        onClose={() => toggleAddMediaModal(false)}
      >
        <MediaForm onClose={() => toggleAddMediaModal(false)} />
      </Modal>
      <Modal
        title="Modifier un média"
        isShown={isUpdateMediaModalShown}
        onClose={() => toggleUpdateMediaModal(false)}
      >
        <MediaForm
          onClose={() => toggleAddMediaModal(false)}
          media={mediaToUpdate}
        />
      </Modal>
    </Main>
  );
};



export default MediaLibrary;