import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import contractService from "@/domain/contracts/services/ContractService";
import { ContractUpdateDto } from "@/domain/contracts/dtos/ContractUpdateDto";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Ensure the request method is one that allows updates (adjust as needed)
  if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Ensure the user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract contract data from the request body (including scanUrl instead of file)
  const editContractDto = req.body as ContractUpdateDto;

  try {
    // Update the contract with the provided scanUrl
    const updatedContract = await contractService.updateOne({
      ...editContractDto,
      scanUrl: editContractDto.scanUrl, // Pass scanUrl instead of scan file
    });

    return res.status(200).json({
      message: "Contract updated successfully",
      contract: updatedContract,
    });
  } catch (error: any) {
    console.error("Error updating contract:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(handler);

// Configure bodyParser if needed for handling JSON requests
export const config = {
  api: {
    bodyParser: true, // Allow body parsing for JSON data
  },
};
