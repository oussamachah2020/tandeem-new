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

interface Props {
    user: AuthenticatedUser
    publications: Awaited<ReturnType<typeof publicationService.getAll>>
}

const MOCK_PUBS = [
  {
    id: "1",
    title: "How to Get Started with React",
    content: `React is a powerful JavaScript library for building user interfaces. In this guide, we cover everything you need to know to start creating your first React app. From setting up the development environment to understanding JSX, components, and state management, you'll learn the foundational concepts needed to build modern web applications.`,
    photo:
      "https://www.angiil.com/wp-content/uploads/2021/11/Pub-e1637242285887.png",
    pinned: true,
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-02T15:30:00Z"),
    customerId: "12345",
  },
  {
    id: "2",
    title: "Mastering TypeScript: Tips and Tricks",
    content: `TypeScript enhances JavaScript by adding static types, helping developers catch bugs earlier in the development process. In this article, we share practical tips and advanced techniques to use TypeScript effectively, including handling complex types, leveraging utility types, and integrating TypeScript with popular frameworks like Angular, React, and Node.js.`,
    photo:
      "https://www.angiil.com/wp-content/uploads/2021/11/Pub-e1637242285887.png",
    pinned: false,
    createdAt: new Date("2024-02-10T09:15:00Z"),
    updatedAt: new Date("2024-02-15T13:45:00Z"),
    customerId: null,
  },
  {
    id: "3",
    title: "Mastering TypeScript: Tips and Tricks",
    content: `TypeScript enhances JavaScript by adding static types, helping developers catch bugs earlier in the development process. In this article, we share practical tips and advanced techniques to use TypeScript effectively, including handling complex types, leveraging utility types, and integrating TypeScript with popular frameworks like Angular, React, and Node.js.`,
    photo:
      "https://www.angiil.com/wp-content/uploads/2021/11/Pub-e1637242285887.png",
    pinned: false,
    createdAt: new Date("2024-02-10T09:15:00Z"),
    updatedAt: new Date("2024-02-15T13:45:00Z"),
    customerId: null,
  },
  {
    id: "4",
    title: "Mastering TypeScript: Tips and Tricks",
    content: `TypeScript enhances JavaScript by adding static types, helping developers catch bugs earlier in the development process. In this article, we share practical tips and advanced techniques to use TypeScript effectively, including handling complex types, leveraging utility types, and integrating TypeScript with popular frameworks like Angular, React, and Node.js.`,
    photo:
      "https://www.angiil.com/wp-content/uploads/2021/11/Pub-e1637242285887.png",
    pinned: false,
    createdAt: new Date("2024-02-10T09:15:00Z"),
    updatedAt: new Date("2024-02-15T13:45:00Z"),
    customerId: null,
  },
  {
    id: "5",
    title: "Mastering TypeScript: Tips and Tricks",
    content: `TypeScript enhances JavaScript by adding static types, helping developers catch bugs earlier in the development process. In this article, we share practical tips and advanced techniques to use TypeScript effectively, including handling complex types, leveraging utility types, and integrating TypeScript with popular frameworks like Angular, React, and Node.js.`,
    photo:
      "https://www.angiil.com/wp-content/uploads/2021/11/Pub-e1637242285887.png",
    pinned: false,
    createdAt: new Date("2024-02-10T09:15:00Z"),
    updatedAt: new Date("2024-02-15T13:45:00Z"),
    customerId: null,
  },
  {
    id: "6",
    title: "Mastering TypeScript: Tips and Tricks",
    content: `TypeScript enhances JavaScript by adding static types, helping developers catch bugs earlier in the development process. In this article, we share practical tips and advanced techniques to use TypeScript effectively, including handling complex types, leveraging utility types, and integrating TypeScript with popular frameworks like Angular, React, and Node.js.`,
    photo:
      "https://www.angiil.com/wp-content/uploads/2021/11/Pub-e1637242285887.png",
    pinned: false,
    createdAt: new Date("2024-02-10T09:15:00Z"),
    updatedAt: new Date("2024-02-15T13:45:00Z"),
    customerId: null,
  },
];

const Publications: NextPage<Props> = ({ user, publications }) => {
  const [, isPublicationCreateModalShown, togglePublicationCreateModal] =
    useModal(false);
  const [
    publicationToUpdate,
    isPublicationUpdateModalShown,
    togglePublicationUpdateModal,
  ] = useModal<ArrayElement<typeof publications>>();

  const [searchResultedPublications, onSearchInputChange] = useSearch<
    ArrayElement<typeof publications>
  >(publications, ["title"]);
  const [filteredPublications, onFilterValueChange] = useFilter<
    ArrayElement<typeof publications>
  >(searchResultedPublications, ["pinned"]);

  return (
    <>
      <Main section={SectionName.Publications} user={user}>
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
          {MOCK_PUBS.length > 0 ? (
            <div className="grid overflow-y-auto grid-cols-1 lg:grid-cols-2 gap-4">
              {MOCK_PUBS.map((publication, idx) => (
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
        </div>
      </Main>
      <Modal
        title="Ajouter une publication"
        isShown={isPublicationCreateModalShown}
        onClose={() => togglePublicationCreateModal(false)}
      >
        <PublicationCreateForm />
      </Modal>
      <Modal
        title="Modifier la publication"
        isShown={isPublicationUpdateModalShown}
        onClose={() => togglePublicationUpdateModal(false)}
      >
        <PublicationUpdateForm publication={publicationToUpdate} />
      </Modal>
    </>
  );
};


// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const user = (await getToken(context)) as unknown as AuthenticatedUser

//     const publications = await publicationService.getAll(user.customer?.id);

//     const result: GetServerSidePropsResult<Props> = {
//         props: {
//             user: JSON.parse(JSON.stringify(user)),
//             publications: JSON.parse(JSON.stringify(publications))
//         }
//     }

//     return result
// }

export default Publications;
