import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {getToken} from "next-auth/jwt";
import ActionBar from "@/common/components/global/ActionBar";
import ideaBoxService from "@/domain/ideabox/services/IdeaBoxService";
import IdeaBoxCard from "@/domain/ideabox/components/IdeaBoxCard";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import { useEffect, useMemo, useState } from "react";
import useSearch from "@/common/hooks/UseSearch";
import useFilter from "@/common/hooks/UseFilter";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import EmptyContent from "@/common/components/atomic/EmptyContent";
import { useAuthStore } from "@/zustand/auth-store";
import { ArrayElement } from "@/common/utils/types";

type Idea = ArrayElement<Awaited<ReturnType<typeof ideaBoxService.getAll>>>;

const IdeaBox = () => {
  const { label } = useStaticValues();
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const employees = useMemo<Record<string, string>>(() => {
    return ideas.reduce((acc, { employee }) => {
      return {
        ...acc,
        [employee.id]: `${employee.firstName} ${employee.lastName}`,
      };
    }, {});
  }, [ideas]);

  const [searchResultedIdeas, onSearchInputChange] = useSearch(ideas, [
    "title",
    "employee.firstName" as any,
    "employee.lastName" as any,
  ]);
  const [filteredIdeas, onFilterValueChange] = useFilter(searchResultedIdeas, [
    "employee.id" as any,
  ]);
  const { authenticatedUser, accessToken } = useAuthStore();

  async function fetchIdeas() {
    if (authenticatedUser) {
      try {
        const response = await fetch(
          `/api/idea-box?id=${authenticatedUser.customerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIdeas(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchIdeas();
  }, [authenticatedUser]);

  return (
    <>
      <Main section={SectionName.IdeaBox} user={authenticatedUser}>
        <ActionBar onSearchInputChange={onSearchInputChange} />
        <FilterGroup>
          <Filter
            label={label.employee}
            icon="UserIcon"
            values={Object.entries(employees)}
            onValueChange={(e: any) =>
              onFilterValueChange("employee.id" as any, e)
            }
          />
        </FilterGroup>
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredIdeas.map((idea, idx) => (
              <IdeaBoxCard key={idx} idea={idea} />
            ))}
          </div>
        ) : (
          <EmptyContent />
        )}
      </Main>
    </>
  );
};


export default IdeaBox;
