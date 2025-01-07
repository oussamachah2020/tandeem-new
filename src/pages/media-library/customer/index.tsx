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
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";

interface Props {
  tandeemMediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>;
  customerMediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>;
}

type Media = Awaited<ReturnType<typeof mediaLibraryService.getAll>>;

const MediaLibrary = ({ customerMediaLibrary = [] }: Props) => {
  const [mediaLibrary, setMediaLibrary] = useState<ArrayElement<Media>[]>([]);

  const [selectedTab, setSelectedTab] = useState(1);
  const [searchResultedTandeemMediaLibrary, onTandeemSearchInputChange] =
    useSearch(mediaLibrary, ["title", "description"]);
  const [searchResultedCustomerMediaLibrary, onCustomerSearchInputChange] =
    useSearch(customerMediaLibrary, ["title", "description"]);
  const [, isAddMediaModalShown, toggleAddMediaModal] = useModal(false);
  const [mediaToUpdate, isUpdateMediaModalShown, toggleUpdateMediaModal] =
    useModal<ArrayElement<Media>>();
  const [loading, setLoading] = useState<boolean>(true);

  const { authenticatedUser, accessToken } = useAuthStore();

  const fetchMedia = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/media-library/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) console.error("Failed to fetch customers.");
      const data = await response.json();
      setMediaLibrary(data);
      console.log({ media: data });
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, []);

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