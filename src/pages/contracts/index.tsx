import {Main} from "@/common/components/global/Main";
import { useEffect, useMemo, useState } from "react";
import { SectionName } from "@/common/security/Sections";
import { Modal } from "@/common/components/global/Modal";
import Tab from "@/common/components/global/Tab";
import ContractPreview from "@/domain/contracts/components/ContractPreview";
import ContractUpdateForm from "@/domain/contracts/components/ContractUpdateForm";
import useModal from "@/common/hooks/UseModal";
import { formatDate, getDownloadUrl } from "@/common/utils/functions";
import { Customer, Partner } from "@prisma/client";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import { ArrayElement } from "@/common/utils/types";
import Datatable from "@/common/components/datatable/Datatable";
import { DatatableRow } from "@/common/components/datatable/DatatableRow";
import { DatatableValue } from "@/common/components/datatable/DatatableValue";
import { ExternalLinkIcon, PenIcon, RefreshCcw } from "lucide-react";
import { useAuthStore } from "@/zustand/auth-store";

type Contract = ArrayElement<
  Awaited<ReturnType<typeof contractService.getAll>>
>;

const Contracts = () => {
  const { authenticatedUser, accessToken } = useAuthStore();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [customerContracts, setCustomerContracts] = useState<Contract[]>([]);
  const [partnerContracts, setPartnerContracts] = useState<Contract[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contracts/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerContracts(data.customerContracts);
        setPartnerContracts(data.partnerContracts);
        setContracts(data.customerContracts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [authenticatedUser]);

  const [contractToShow, isContractModalShown, toggleContractModal] =
    useModal<Contract>();
  const [contractToUpdate, isEditContractModalShown, toggleEditContractModal] =
    useModal<Contract>();

  const contractorToShow = useMemo<Customer | Partner>(
    () => contractToShow?.partner ?? contractToShow?.customer!,
    [contractToShow?.partner, contractToShow?.customer]
  );
  const contractorToUpdate = useMemo<Customer | Partner>(
    () => contractToUpdate?.partner ?? contractToUpdate?.customer!,
    [contractToUpdate?.partner, contractToUpdate?.customer]
  );

  const [searchResultedContracts, onSearchInputChange] = useSearch<Contract>(
    contracts,
    ["partner.name" as any, "customer.name" as any]
  );


  return (
    <>
      <Main section={SectionName.Contracts} user={authenticatedUser}>
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
          {loading ? (
            <div className="h-40 flex justify-center items-center w-full bg-white">
              <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <Datatable
              isEmpty={searchResultedContracts?.length === 0}
              headers={[
                "Scan",
                "Date de début",
                "Date de fin",
                "Date de résiliation anticipée",
                "Statut",
                "Actions",
              ]}
            >
              {searchResultedContracts?.map((contract) => (
                <DatatableRow key={contract.id}>
                  <DatatableValue>
                    {/* <embed
                      src={contract.scan}
                      className="h-20 rounded-md w-20 object-contain"
                    /> */}
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
                          : contract.status === "Terminated"
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
                      <ExternalLinkIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleEditContractModal(true, contract)}
                      className="bg-gray-200 h-8 w-8 flex justify-center items-center rounded-full"
                    >
                      <PenIcon className="h-4 w-4" />
                    </button>
                  </DatatableValue>
                </DatatableRow>
              ))}
            </Datatable>
          )}
        </Tab>
      </Main>
      <Modal
        title={`Contrat de '${contractorToShow?.name}'`}
        isShown={isContractModalShown}
        onClose={() => toggleContractModal(false)}
        width="w-9/12"
      >
        <ContractPreview href={contractToShow?.scan} />
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

export default Contracts;