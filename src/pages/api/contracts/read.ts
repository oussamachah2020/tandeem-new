import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { NextApiResponse } from "next";
import contractService from "@/domain/contracts/services/ContractService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const contracts = await contractService.getAll();
    const customerContracts = contracts.filter((contract) => contract.customer);
    const partnerContracts = contracts.filter((contract) => contract.partner);

    return res.status(200).json({
      customerContracts,
      partnerContracts,
    });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return res.status(500).json({ error: "Failed to fetch contracts" });
  }
}

export default authMiddleware(handler);
