import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import Tab from "@/common/components/global/Tab";
import {useMemo, useState} from "react";
import offerService from "@/domain/offers/shared/services/OfferService";
import {getToken} from "next-auth/jwt";
import {ExternalOffers} from "@/domain/offers/level-two/components/ExternalOffers";
import {InternalOffers} from "@/domain/offers/level-two/components/InternalOffers";
import customerService from "@/domain/customers/services/CustomerService";
import {AcceptableOffer} from "@/domain/offers/level-two/models/AcceptableOffer";

interface Props {
    user: AuthenticatedUser
    customer: NonNullable<Awaited<ReturnType<typeof customerService.getOne>>>
    offers: Awaited<ReturnType<typeof offerService.getAllForLevel2>>
}

const OffersPage: NextPage<Props> = ({user, customer, offers}) => {
    const acceptableOffers =
        useMemo((): AcceptableOffer[] =>
            offers.map((offer) => {
                    const acceptedBy = offer.acceptedBy.find(({customerId}) => customerId === user.customer?.id)
                    if (acceptedBy) return {
                        ...offer,
                        accepted: true,
                        acceptedFor: acceptedBy.for,
                        pinned: acceptedBy.pinned
                    }
                    else return {...offer, accepted: false}
                }
            ), [offers, user.customer?.id])
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <Main section={SectionName.Offers} user={user}>
            <Tab
                tabs={[
                    {text: 'Les plans tandeem', icon: 'ReceiptPercentIcon', onClick: () => setSelectedTab(0)},
                    {text: 'Mes offres exclusives', icon: 'TicketIcon', onClick: () => setSelectedTab(1)}
                ]}
                selectedTabIndex={selectedTab}
            >
                {selectedTab === 0 ? <ExternalOffers offers={acceptableOffers}/> :
                    <InternalOffers customer={customer}/>}
            </Tab>
        </Main>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser
    const customer = await customerService.getOne(user.customer!.id)
    const offers = await offerService.getAllForLevel2()
    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            customer: JSON.parse(JSON.stringify(customer)),
            offers: JSON.parse(JSON.stringify(offers)),
        }
    }

    return result
}

export default OffersPage;