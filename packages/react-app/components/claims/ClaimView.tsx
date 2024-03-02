import { Box, Button, Center, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import {
  Web3Button,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import React from "react";
import { TOKEN_DROP } from "../../constants/addresses";
import { StarIcon } from "../icons/StarIcon";
import { WalletSkeleton } from "../wallet/WalletSkeleton";


export const ClaimView = () => {
  const { contract } = useContract(TOKEN_DROP);

  const { data: contractMetadata, isLoading } = useContractMetadata(contract);
  const claimAmount = 10;
  const toast = useToast();

  if (isLoading) {
    return <WalletSkeleton />;
  }
  return (
    <Stack
      w={"100%"}
      h={"230px"}
      bg={"white"}
      borderRadius={16}
      p={4}
      justify={"space-between"}
      boxShadow="0px 4px 20px 0px #00CC66"
    >
      <HStack justify={'space-between'}>
      <Stack>
      <Stack
        bg={"black"}
        w={"61px"}
        h={"61px"}
        borderRadius={"16px"}
        justify={"center"}
        align={"center"}
      >
        <StarIcon />
      </Stack>
      <Stack gap={0}>
        <Text fontSize={"18px"} color={"green"}>
          Earn
        </Text>
        <Text fontSize={"32px"} color={"black"} fontWeight={700}>
          ${contractMetadata?.symbol}
        </Text>
      </Stack>
      </Stack>

      <Box />
      </HStack>
      <Center>
        <Web3Button
          style={{
            background: "yellow",
            height: "37px",
            color: "black",
            borderRadius: "10px",
            width: "fit-content",
            padding: "0px 30px",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
          }}
          contractAddress={TOKEN_DROP}
          action={(contract: { erc20: { claim: (arg0: number) => any; }; }) => contract.erc20.claim(claimAmount)}
          onSuccess={() =>
            toast({
              title: "Claime Successful",
              status: "success",
              duration: 9000,
              isClosable: true,
            })
          }
        >
          Claim free tokens
        </Web3Button>
      </Center>
    </Stack>
  );
};
