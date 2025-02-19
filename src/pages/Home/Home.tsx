// import { Button } from "@/components/ui/button";
import { useQuery } from "@apollo/client";
import { GET_ATTESTATIONS_BY_WALLET_ID } from "@/utils/graphql-queries";

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
import { useEthersSigner } from "@/utils/wagmi-utils";
import { useState } from 'react';

//@ts-ignore

const NETWORK = import.meta.env.NETWORK; 

export const HomeScreen = () => {
  const navigate = useNavigate();
  const signer = useEthersSigner()
  const [currentPage, setCurrentPage] = useState(0);

  // const { address } = useAccount();

  const { loading, error, data } = useQuery(GET_ATTESTATIONS_BY_WALLET_ID, {
    variables: {
      where: {
        creator: {
          // equals: address,
        },
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const offChainCount = data.schemata.reduce((acc: number, schema: any) => {
    return (
      acc +
      schema.attestations.filter((attestation: any) => attestation.isOffchain)
        .length
    );
  }, 0);

  const onChainCount = data.schemata.reduce((acc: number, schema: any) => {
    return (
      acc +
      schema.attestations.filter((attestation: any) => !attestation.isOffchain)
        .length
    );
  }, 0);

  const itemsPerPage = 10; // Define how many items you want per page
  const totalItems = data.schemata.length; // Total number of items
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

  // Calculate the starting index for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the data to get only the entries for the current page
  const currentData = data.schemata.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">EAS Flow Scanner</p>
        <EasCreateSchema network='flowTestnet'
          signer={signer!}
          onSchemaCreated={(schemaId: string) => {
            console.log('Schema created:', schemaId);
            navigate(`/schema/view/${schemaId}`)
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-10 mt-4 mb-4">
        <StatsCard
          title="All Schemas"
          value={data.schemata.length ?? "Err"}
          change="+4.5%"
          changeText="from last week"
          changeColor="bg-lime-400/20 text-lime-700"
        />
        <StatsCard
          title="OnChain Attestations"
          value={onChainCount}
          change="+4.5%"
          changeText="from last week"
          changeColor="bg-lime-400/20 text-lime-700"
        />
        <StatsCard
          title="OffChain Attestations"
          value={offChainCount}
          change="+4.5%"
          changeText="from last week"
          changeColor="bg-lime-400/20 text-lime-700"
        />
      </div>

      <div className="mt-10 ">
        <h2 className="text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">
          Schemas
        </h2>

        <Table className="mt-4 cursor-pointer">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-4">ID</TableHead>
              <TableHead className="px-4 py-4">UID</TableHead>
              <TableHead className="px-4 py-4">Schema</TableHead>
              <TableHead className="px-4 py-4">Attestations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((schema: any) => (
              <TableRow
                key={schema.id}
                onClick={() => navigate(`/schema/view/${schema.id}`)}
              >
                <TableCell className="font-medium px-4 py-4">
                  #{schema.index}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {truncateString(schema.id)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {schema.schema
                    .split(",")
                    .map((type: string, idx: number) => {
                      return (
                        <Badge key={idx} variant="secondary">
                          {type}
                        </Badge>
                      )
                    })}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {schema._count.attestations}
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
