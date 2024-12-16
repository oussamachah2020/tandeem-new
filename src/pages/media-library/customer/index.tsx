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
import {useState} from "react";

interface Props {
    user: AuthenticatedUser;
    tandeemMediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>
    customerMediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>
}

const MediaLibrary: NextPage<Props> = ({user, tandeemMediaLibrary, customerMediaLibrary}) => {
    const [selectedTab, setSelectedTab] = useState(1)
    const [searchResultedTandeemMediaLibrary, onTandeemSearchInputChange] = useSearch(tandeemMediaLibrary, ['title', 'description'])
    const [searchResultedCustomerMediaLibrary, onCustomerSearchInputChange] = useSearch(customerMediaLibrary, ['title', 'description'])
    const [, isAddMediaModalShown, toggleAddMediaModal] = useModal(false)
    const [mediaToUpdate, isUpdateMediaModalShown, toggleUpdateMediaModal] = useModal<ArrayElement<typeof tandeemMediaLibrary>>()

    return (
        <Main section={SectionName.MediaLibrary} user={user}>
            <Tab
                tabs={[
                    {
                        icon: 'RectangleStackIcon',
                        text: 'Médiathèque de tandeem',
                        onClick: () => setSelectedTab(0)
                    },
                    {
                        icon: 'RectangleStackIcon',
                        text: 'Ma médiathèque',
                        onClick: () => setSelectedTab(1)
                    }
                ]}
                selectedTabIndex={selectedTab}
            >
                <div className={selectedTab === 0 ? '' : 'hidden'}>
                    <ActionBar onSearchInputChange={onTandeemSearchInputChange}/>
                    <MediaLibraryTable mediaLibrary={searchResultedTandeemMediaLibrary} canDelete={false}/>
                </div>
                <div className={selectedTab === 1 ? '' : 'hidden'}>
                    <ActionBar
                        onSearchInputChange={onCustomerSearchInputChange}
                        action={{text: 'Ajouter un média', onClick: () => toggleAddMediaModal(true)}}
                    />
                    <MediaLibraryTable
                        mediaLibrary={searchResultedCustomerMediaLibrary}
                        onUpdate={(media) => toggleUpdateMediaModal(true, media)}
                    />
                </div>

            </Tab>
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
    )
        ;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser;
    if (getRoleLevel(user.role) === 1) return ({redirect: {destination: '/media-library', permanent: true}})
    const tandeemMediaLibrary = await mediaLibraryService.getAll()
    const customerMediaLibrary = await mediaLibraryService.getAll(user.customer?.id)

    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            tandeemMediaLibrary: JSON.parse(JSON.stringify(tandeemMediaLibrary)),
            customerMediaLibrary: JSON.parse(JSON.stringify(customerMediaLibrary))
        },
    };

    return result;
};

export default MediaLibrary;