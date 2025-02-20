// import { Button } from "@/components/ui/button";
import { useQuery } from "@apollo/client";
import { GET_ATTESTATIONS } from "@/utils/graphql-queries";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components";
// import { useAccount } from "wagmi";
import { truncateString } from "@/utils/misc";
import { EasCreateSchema } from "@credora/eas-react"
import { EasAttest } from "@credora/eas-react"
import { useEthersSigner } from "@/utils/wagmi-utils";
import { useState } from 'react';
import { networkMap } from "@/utils/utils";
 
const NETWORK = import.meta.env.NETWORK; 


//@ts-ignore

export const Attestations = () => {
  const navigate = useNavigate();
  const signer = useEthersSigner()
  const [currentPage, setCurrentPage] = useState(0);
  const [schemaId, setSchemaId] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // const { address } = useAccount();

  const { loading, error, data } = useQuery(GET_ATTESTATIONS);

  console.log(data)
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const totalAttestations = data.attestations.length; // Total number of attestations
  const uniqueSigners = new Set(data.attestations.map((attestation: any) => attestation.attester)).size; // Count unique signers

  const itemsPerPage = 10; // Define how many items you want per page
  const totalPages = Math.ceil(totalAttestations / itemsPerPage); // Calculate total pages

  // Calculate the starting index for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the data to get only the entries for the current page
  const currentData = data.attestations.slice(startIndex, endIndex);

  // Add this function to validate the schemaId format
  const isValidSchemaId = (schemaid: string) => {
    const regex = /^0x[a-fA-F0-9]{64}$/; // Regex to match Ethereum address format
    if (regex.test(schemaid)) {
      // const { loading, error } = useQuery(GET_SCHEMA_BY_ID, {
      //   variables: {
      //     where: {
      //       id: schemaid,
      //     },
      //   },
      // });
      // if (loading) return false; // Return false while loading
      // if (error) return false; // Return false if there's an error
      return true;
    }else{
      return false;
    }

  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">EAS Flow Scanner - Attestations</p>
        
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded" 
          onClick={() => setIsPanelOpen(true)}
        >
          Make Attestation
        </button>
        
        {isPanelOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold">Insert Schema ID</h2>
              <input 
                type="text" 
                value={schemaId} 
                onChange={(e) => setSchemaId(e.target.value)} 
                placeholder="Enter or search schema ID" 
                className="border p-2 rounded w-full"
              />
              <div className="mt-4">
                <button onClick={() => setIsPanelOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Close</button>
                {isValidSchemaId(schemaId) && ( // Render the attestation button only if schemaId is valid
                  <div className="mt-4">
                    <EasAttest 
                        text="Make Attestation"
                        schemaId={schemaId}
                        network={networkMap[NETWORK || "flowTestnet"].chainName as "flowTestnet" | "sepolia" | "mainnet" | "flowMainnet"}
                        signer={signer!}
                        buttonProps={{
                          width: "full"
                        }}
                        onAttestationComplete={(attestation) => {
                          console.log('Attestation complete', attestation);
                          navigate(`/attestation/view/${attestation.attestationUid}`);
                        }}
                      />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-10 mt-4 mb-4">
        <StatsCard
          title="Total Attestations"
          value={totalAttestations ?? "Err"}
          change=""
          changeText=""
          changeColor="bg-lime-400/20 text-lime-700"
        />
        <StatsCard
          title="Unique Creators"
          value={uniqueSigners}
          change=""
          changeText=""
          changeColor="bg-lime-400/20 text-lime-700"
        />
      </div>

      <div className="mt-10 ">
        <h2 className="text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">
          Attestations
        </h2>

        <Table className="mt-4 cursor-pointer">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-4">UID</TableHead>
              <TableHead className="px-4 py-4">Schema</TableHead>
              <TableHead className="px-4 py-4">From</TableHead>
              <TableHead className="px-4 py-4">To</TableHead>
              <TableHead className="px-4 py-4">Type</TableHead>
              <TableHead className="px-4 py-4">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((attestation: any) => (
              <TableRow
                key={attestation.id}
                onClick={() => navigate(`/attestation/view/${attestation.id}`)}
                className="hover:bg-gray-200"
              >
                <TableCell className="px-4 py-4">
                  {truncateString(attestation.id)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {truncateString(attestation.schemaId)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {truncateString(attestation.attester)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {truncateString(attestation.recipient)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {attestation.isOffchain ? "Offchain" : "Onchain"}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {new Date(attestation.timeCreated * 1000).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center mt-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  href="#" 
                  isActive={index === currentPage} 
                  onClick={() => setCurrentPage(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
