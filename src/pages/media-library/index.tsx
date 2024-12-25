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
import { useAuthStore } from "@/zustand/auth-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

interface Props {
  user: AuthenticatedUser;
  mediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>;
}

const MediaLibrary = ({}) => {
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [searchResultedMediaLibrary, onSearchInputChange] = useSearch(
    mediaLibrary,
    ["title", "description"]
  );
  const [, isAddMediaModalShown, toggleAddMediaModal] = useModal(false);
  const [mediaToUpdate, isUpdateMediaModalShown, toggleUpdateMediaModal] =
    useModal<ArrayElement<typeof mediaLibrary>>();
  const [loading, setLoading] = useState<boolean>(true);

  const { accessToken, authenticatedUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (authenticatedUser) {
      if (getRoleLevel(authenticatedUser?.role) === 2) {
        router.replace("/media-library/customer");
      }
    }
  }, [authenticatedUser]);

  const fetchMedia = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/media-library/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch customers.");
      const data = await response.json();
      setMediaLibrary(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [authenticatedUser]);

  return (
    <Main section={SectionName.MediaLibrary} user={authenticatedUser}>
      <ActionBar
        onSearchInputChange={onSearchInputChange}
        action={{
          text: "Ajouter un média",
          onClick: () => toggleAddMediaModal(true),
        }}
      />
      {loading ? (
        <div className="h-40 flex justify-center items-center w-full bg-white">
          <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <MediaLibraryTable
          mediaLibrary={searchResultedMediaLibrary}
          onUpdate={(media) => toggleUpdateMediaModal(true, media)}
        />
      )}
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
