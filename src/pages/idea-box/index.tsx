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
import {useMemo} from "react";
import useSearch from "@/common/hooks/UseSearch";
import useFilter from "@/common/hooks/UseFilter";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import EmptyContent from "@/common/components/atomic/EmptyContent";

interface Props {
    user: AuthenticatedUser
    ideas: Awaited<ReturnType<typeof ideaBoxService.getAll>>
}

const IdeaBox: NextPage<Props> = ({user, ideas}) => {
    const {label} = useStaticValues()
    const employees = useMemo<Record<string, string>>(() => {
        return ideas
            .reduce((acc, {employee}) => {
                return ({...acc, [employee.id]: `${employee.firstName} ${employee.lastName}`});
            }, {})
    }, [ideas])

    const [searchResultedIdeas, onSearchInputChange] = useSearch(ideas, ['title', 'employee.firstName' as any, 'employee.lastName' as any])
    const [filteredIdeas, onFilterValueChange] = useFilter(searchResultedIdeas, ['employee.id' as any])

    return (
        <>
            <Main section={SectionName.IdeaBox} user={user}>
                <ActionBar onSearchInputChange={onSearchInputChange}/>
                <FilterGroup>
                    <Filter
                        label={label.employee}
                        icon='UserIcon'
                        values={Object.entries(employees)}
                        onValueChange={(e: any) => onFilterValueChange('employee.id' as any, e)}
                    />
                </FilterGroup>
                {filteredIdeas.length > 0 ?
                    <div className='grid grid-cols-3 gap-4'>
                        {filteredIdeas.map((idea, idx) =>
                            <IdeaBoxCard key={idx} idea={idea}/>)}
                    </div>
                    : <EmptyContent/>}
            </Main>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser

    const ideas = await ideaBoxService.getAll(user.customer?.id!)

    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            ideas: JSON.parse(JSON.stringify(ideas))
        }
    }

    return result
}

export default IdeaBox;
