import {JobLevel, OfferStatusName, PaymentMethod} from "@prisma/client";
import { ContractStatusName } from "@prisma/client";

export const contractStatuses: Record<ContractStatusName, string> =
    {
        [ContractStatusName.Active]: 'Actif',
        [ContractStatusName.SoonToBeEnded]: 'Bientôt Terminé',
        [ContractStatusName.Ended]: 'Terminé',
        [ContractStatusName.SoonToBeTerminated]: 'Bientôt Résilié',
        [ContractStatusName.Terminated]: 'Résilié'
    }

export const paymentMethods: Record<PaymentMethod, string> =
    {
        [PaymentMethod.Card]: 'Carte Tandeem',
        [PaymentMethod.Ticket]: 'Billet',
        [PaymentMethod.Coupon]: 'Coupon',
        [PaymentMethod.PromoCode]: 'Code Promo'
    }
export const jobLevels: Record<JobLevel, string> =
    {
        [JobLevel.BoardMember]: 'Conseil d\'administration',
        [JobLevel.CEO]: 'Président CEO',
        [JobLevel.ExecutiveCommittee]: 'Comité de Direction',
        [JobLevel.Manager]: 'Manager',
        [JobLevel.ProjectLead]: 'Chef de Projet',
        [JobLevel.TeamLead]: 'Superviseur/Chef d\'équipe',
        [JobLevel.Coordinator]: 'Coordinateur',
        [JobLevel.Technician]: 'Technicien',
        [JobLevel.Assistant]: 'Assistant/adjoint',
        [JobLevel.Intern]: 'Stagiaire'
    }
export const offerStatuses: Record<OfferStatusName, string> = {
    [OfferStatusName.Active]: 'Actif',
    [OfferStatusName.Inactive]: 'Inactif',
    [OfferStatusName.NoContract]: 'Fin de contrat'
}

export const labeledContractStatuses = Object.entries(contractStatuses) as [ContractStatusName, string][]
export const labeledPaymentMethods = Object.entries(paymentMethods).slice(2) as [PaymentMethod, string][]
export const labeledJobLevels = Object.entries(jobLevels) as [JobLevel, string][]
export const labeledOfferStatuses = Object.entries(offerStatuses) as [OfferStatusName, string][]
export const labeledAcceptableOfferStatuses = [['true', 'Accepté'], ['false', 'À accepter']] as [string, string][]