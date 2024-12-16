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
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
    user: AuthenticatedUser;
    mediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>
}

const MediaLibrary: NextPage<Props> = ({user, mediaLibrary}) => {
    const [searchResultedMediaLibrary, onSearchInputChange] = useSearch(mediaLibrary, ['title', 'description'])
    const [, isAddMediaModalShown, toggleAddMediaModal] = useModal(false)
    const [mediaToUpdate, isUpdateMediaModalShown, toggleUpdateMediaModal] = useModal<ArrayElement<typeof mediaLibrary>>()
    const { authenticatedUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (authenticatedUser) {
        if (getRoleLevel(authenticatedUser?.role) === 2)
          return router.replace("/media-library/customer");
      }
    }, [authenticatedUser]);

    return (
        <Main section={SectionName.MediaLibrary} user={user}>
            <ActionBar
                onSearchInputChange={onSearchInputChange}
                action={{text: 'Ajouter un média', onClick: () => toggleAddMediaModal(true)}}
            />
            <MediaLibraryTable
                mediaLibrary={searchResultedMediaLibrary}
                onUpdate={(media) => toggleUpdateMediaModal(true, media)}
            />
            <Modal
                title='Ajouter un média'
                isShown={isAddMediaModalShown}
                onClose={() => toggleAddMediaModal(false)}
            >
                <MediaForm/>
            </Modal>
            <Modal
                title='Modifier un média'
                isShown={isUpdateMediaModalShown}
                onClose={() => toggleUpdateMediaModal(false)}
            >
                <MediaForm media={mediaToUpdate}/>
            </Modal>
        </Main>
    );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     // const user = (await getToken(context)) as unknown as AuthenticatedUser;
    // if (getRoleLevel(authenticatedUser?.role) === 2) return ({redirect: {destination: '/media-library/customer', permanent: true}})
//     const mediaLibrary = await mediaLibraryService.getAll(user.customer?.id)

//     const result: GetServerSidePropsResult<Props> = {
//         props: {
//             user: JSON.parse(JSON.stringify(user)),
//             mediaLibrary: JSON.parse(JSON.stringify(mediaLibrary))
//         },
//     };

//     return result;
// };

export default MediaLibrary;
