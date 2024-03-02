import { HStack, Stack } from "@chakra-ui/react";
import { WalletView } from "./wallet/WalletView";
import { RaffleView } from "./raffle/RaffleView";
import React from 'react'
import { ClaimView } from "./claims/ClaimView";

export const Connected = ({address}: any) => {

  console.log(address);
  
  return (
    <Stack gap={8} w={"100%"}>
      
      <HStack w={"100%"} gap={8} flexDir={["column", null, "row"]} pt={8}>
      <WalletView address={address}/>
      <ClaimView />
      </HStack>
     <RaffleView address={address}/>
    </Stack>
  );
};
