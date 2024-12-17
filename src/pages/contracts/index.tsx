import {Main} from "@/common/components/global/Main";
import {useMemo, useState} from "react";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {Modal} from "@/common/components/global/Modal";
import contractService from "@/domain/contracts/services/ContractService";
import Tab from "@/common/components/global/Tab";
import ContractPreview from "@/domain/contracts/components/ContractPreview";
import ContractUpdateForm from "@/domain/contracts/components/ContractUpdateForm";
import {AuthenticatedUser} from "@/common/services/AuthService";
import useModal from "@/common/hooks/UseModal";
import {getToken} from "next-auth/jwt";
import { formatDate, getDownloadUrl } from "@/common/utils/functions";
import { Customer, Partner } from "@prisma/client";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import EmptyContent from "@/common/components/atomic/EmptyContent";
import ContractCard from "@/domain/contracts/components/ContractCard";
import { ArrayElement } from "@/common/utils/types";
import Datatable from "@/common/components/datatable/Datatable";
import { DatatableRow } from "@/common/components/datatable/DatatableRow";
import { DatatableValue } from "@/common/components/datatable/DatatableValue";
import { ExternalLinkIcon, PenIcon } from "lucide-react";

interface Props {
  user: AuthenticatedUser;
  customerContracts: Awaited<ReturnType<typeof contractService.getAll>>;
  partnerContracts: Awaited<ReturnType<typeof contractService.getAll>>;
}

const MOCK_CONTRACTS = [
  {
    id: "1",
    scan: "SCAN123456",
    from: "2023-01-01T00:00:00.000Z",
    to: "2024-01-01T00:00:00.000Z",
    prematureTo: null,
    status: "Active", // ContractStatusName - Active, Expired, etc.
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-06-01T00:00:00.000Z",
    customer: { name: "Tech Solutions Inc." },
    partner: { name: "Green Farms Co." },
  },
  {
    id: "2",
    scan: "SCAN789012",
    from: "2023-03-01T00:00:00.000Z",
    to: "2023-09-01T00:00:00.000Z",
    prematureTo: "2023-08-01T00:00:00.000Z",
    status: "Expired",
    createdAt: "2023-03-01T00:00:00.000Z",
    updatedAt: "2023-08-01T00:00:00.000Z",
    customer: { name: "HealthFirst Clinics" },
    partner: { name: "AutoDrive Motors" },
  },
  {
    id: "3",
    scan: "SCAN345678",
    from: "2023-06-15T00:00:00.000Z",
    to: "2025-06-15T00:00:00.000Z",
    prematureTo: null,
    status: "Active",
    createdAt: "2023-06-15T00:00:00.000Z",
    updatedAt: "2023-06-15T00:00:00.000Z",
    customer: { name: "EduSpark Academy" },
    partner: { name: "Culinary Creations" },
  },
  {
    id: "4",
    scan: "SCAN901234",
    from: "2023-07-01T00:00:00.000Z",
    to: "2024-07-01T00:00:00.000Z",
    prematureTo: "2024-06-01T00:00:00.000Z",
    status: "Pending",
    createdAt: "2023-07-01T00:00:00.000Z",
    updatedAt: "2023-06-15T00:00:00.000Z",
    customer: { name: "UrbanStyle Architects" },
    partner: { name: "Green Farms Co." },
  },
  {
    id: "5",
    scan: "SCAN567890",
    from: "2024-01-01T00:00:00.000Z",
    to: "2026-01-01T00:00:00.000Z",
    prematureTo: null,
    status: "Active",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    customer: { name: "AutoDrive Motors" },
    partner: { name: "HealthFirst Clinics" },
  },
];

const Contracts: NextPage<Props> = ({
  user,
  customerContracts,
  partnerContracts,
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [contracts, setContracts] = useState(customerContracts);

  const [contractToShow, isContractModalShown, toggleContractModal] =
    useModal<ArrayElement<typeof contracts>>();
  const [contractToUpdate, isEditContractModalShown, toggleEditContractModal] =
    useModal<ArrayElement<typeof contracts>>();

  const contractorToShow = useMemo<Customer | Partner>(
    () => contractToShow?.partner ?? contractToShow?.customer!,
    [contractToShow?.partner, contractToShow?.customer]
  );
  const contractorToUpdate = useMemo<Customer | Partner>(
    () => contractToUpdate?.partner ?? contractToUpdate?.customer!,
    [contractToUpdate?.partner, contractToUpdate?.customer]
  );

  const [searchResultedContracts, onSearchInputChange] = useSearch<
    ArrayElement<typeof contracts>
  >(contracts, ["partner.name" as any, "customer.name" as any]);

  return (
    <>
      <Main section={SectionName.Contracts} user={user}>
        <ActionBar onSearchInputChange={onSearchInputChange} />
        <Tab
          tabs={[
            {
              text: SectionName.Customers,
              icon: "BuildingOfficeIcon",
              onClick: () => {
                setSelectedTabIndex(0);
                setContracts(customerContracts);
              },
            },
            {
              text: SectionName.Partners,
              icon: "BriefcaseIcon",
              onClick: () => {
                setSelectedTabIndex(1);
                setContracts(partnerContracts);
              },
            },
          ]}
          selectedTabIndex={selectedTabIndex}
        >
          {/* {MOCK_DATA.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {MOCK_DATA.map((contract, idx) => (
                <ContractCard
                  key={idx}
                  contract={contract}
                  onClick={() => toggleContractModal(true, contract)}
                  onUpdate={() => toggleEditContractModal(true, contract)}
                />
              ))}
            </div>
          ) : (
            <EmptyContent />
          )} */}

          <Datatable
            isEmpty={MOCK_CONTRACTS.length === 0}
            headers={[
              "Scan",
              "Date de début",
              "Date de fin",
              "Date de résiliation anticipée",
              "Statut",
            ]}
          >
            {MOCK_CONTRACTS.map((contract) => (
              <DatatableRow key={contract.id}>
                <DatatableValue>
                  <a
                    href={contract.scan}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir le contrat
                  </a>
                </DatatableValue>
                <DatatableValue>
                  {formatDate(new Date(contract.from))}
                </DatatableValue>
                <DatatableValue>
                  {formatDate(new Date(contract.to))}
                </DatatableValue>
                <DatatableValue>
                  {contract.prematureTo
                    ? formatDate(new Date(contract.prematureTo))
                    : "Non applicable"}
                </DatatableValue>
                <DatatableValue>
                  <span
                    className={`px-2 py-1 text-sm font-medium rounded ${
                      contract.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : contract.status === "Expired"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {contract.status}
                  </span>
                </DatatableValue>
                <DatatableValue className="flex flex-row items-center gap-2">
                  <button
                    onClick={() => toggleContractModal(true, contract)}
                    className="bg-gray-200 h-8 w-8 flex justify-center items-center rounded-full"
                  >
                    <ExternalLinkIcon className="h-4 w-4 " />
                  </button>
                  <button
                    onClick={() => toggleEditContractModal(true, contract)}
                    className="bg-gray-200 h-8 w-8 flex justify-center items-center rounded-full"
                  >
                    <PenIcon className="h-4 w-4 " />
                  </button>
                </DatatableValue>
              </DatatableRow>
            ))}
          </Datatable>
        </Tab>
      </Main>
      <Modal
        title={`Contrat de '${contractorToShow?.name}'`}
        isShown={isContractModalShown}
        onClose={() => toggleContractModal(false)}
        width="w-9/12"
      >
        <ContractPreview href={getDownloadUrl(contractToShow?.scan)} />
      </Modal>
      <Modal
        title="Modifier le contrat"
        isShown={isEditContractModalShown}
        onClose={() => toggleEditContractModal(false)}
        width="w-6/12"
      >
        <ContractUpdateForm
          contract={contractToUpdate}
          contractor={contractorToUpdate!}
        />
      </Modal>
    </>
  );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser

    const contracts = await contractService.getAll()
    const customerContracts = contracts.filter((contract) => contract.customer)
    const partnerContracts = contracts.filter((contract) => contract.partner)

    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            customerContracts: JSON.parse(JSON.stringify(customerContracts)),
            partnerContracts: JSON.parse(JSON.stringify(partnerContracts))
        }
    }

    return result
}

export default Contracts;
