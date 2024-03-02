import { Avatar, Badge, HStack, Text } from "@chakra-ui/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../constants/addresses";

type Props = {
  walletAddress: string;
  index: number;
};

const EntryCard: React.FC<Props> = ({ walletAddress, index }) => {
  const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);

  const { data: numberOfEntries, isLoading: numberOfEntriesLoading } =
    useContractRead(contract, "entryCount", [walletAddress]);

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  return (
    <HStack w={"100%"} borderRadius={4}>
      {!numberOfEntriesLoading && (
        <HStack justifyContent={"space-between"} w={"100%"} p={2}>
          <HStack>
            <Text fontSize={"16px"} fontWeight={500} color={"black"}>
              {index + 1}
            </Text>
            <Avatar bg={"green"} size={"sm"} />
            <Text fontSize={"16px"} fontWeight={500} color={"black"}>
              {truncateAddress(walletAddress)}
            </Text>
          </HStack>
          <Text fontSize={"16px"} fontWeight={500} color={"green"}>
            Entries: {numberOfEntries.toNumber()}
          </Text>
        </HStack>
      )}
    </HStack>
  );
};

export default EntryCard;
