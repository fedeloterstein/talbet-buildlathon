import { IconButton, Stack, Text } from "@chakra-ui/react";
import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import React from "react";
import { TOKEN_DROP } from "../../constants/addresses";
import { WalletSkeleton } from "./WalletSkeleton";
import { WalletIcon } from "../icons/WalletIcon";

export const WalletView = ({ address }: any) => {
  const { contract } = useContract(TOKEN_DROP, "token");
  const { data: tokenDropData, isLoading: isLoadingTokenDrop } =
    useTokenBalance(contract, address!);

  if (isLoadingTokenDrop) {
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
      <Stack
        bg={"black"}
        w={"61px"}
        h={"61px"}
        borderRadius={"16px"}
        justify={"center"}
        align={"center"}
      >
        <WalletIcon />
      </Stack>
      <Stack gap={0}>
        <Text fontSize={"18px"} color={"green"}>
          Balance
        </Text>
        <Text fontSize={"32px"} color={"black"} fontWeight={700}>
          {tokenDropData?.displayValue} ${tokenDropData?.symbol}
        </Text>
      </Stack>

      <Text fontSize={"16px"} fontWeight={500}>
        {address}
      </Text>
    </Stack>
  );
};
