import { Spinner, Stack } from "@chakra-ui/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../constants/addresses";
import EntryCard from "./EntryCard";
import React from 'react'

export default function CurrentEntries({ lastWinner }: any) {
  const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);

  const { data: entries, isLoading: entriesLoading } = useContractRead(
    contract,
    "getPlayers"
  );

  return (
    <Stack w={"100%"} overflowY="scroll" h={['auto', "400px"]} >
      {!entriesLoading ? (
        <Stack>
          {entries.map((entry: any, index: number) => (
            <EntryCard key={index} index={index} walletAddress={entry} />
          ))}
        </Stack>
      ) : (
        <Spinner />
      )}
    </Stack>
  );
}
