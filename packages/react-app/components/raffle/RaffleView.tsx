import { Button, HStack, Heading, Input, Stack, Text } from "@chakra-ui/react";
import {
  Web3Button,
  useAddress,
  useBalance,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import React, { useState } from "react";
import { LOTTERY_CONTRACT_ADDRESS } from "../../constants/addresses";
import { ethers } from "ethers";
import CurrentEntries from "../CurrentEntries";
import { CoinsIcon } from "../icons/CoinsIcon";
import { RaffleSkeleton } from "./RaffleSkeleton";

export const RaffleView = () => {
  const address = useAddress();

  const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);
  const { data: tokenAddress } = useContractRead(contract, "tokenAddress", []);
  const { data } = useBalance(tokenAddress);

  const { contract: tokenContract, isLoading: tokenContractLoding } = useContract(tokenAddress, "token");

  const { data: entryCost, isLoading: entryCostLoading } = useContractRead(
    contract,
    "entryCost"
  );

  const entryCostInEther = entryCost
    ? ethers.utils.formatEther(entryCost)
    : "0";

  const { data: raffleStatus, isLoading: raffleStatusLoading  } = useContractRead(contract, "raffleStatus");

  const [entryAmount, setEntryAmount] = useState(0);
  const entryCostSubmit = parseFloat(entryCostInEther) * entryAmount;

  function increaseEntryAmount() {
    setEntryAmount(entryAmount + 1);
  }

  function decreaseEntryAmount() {
    if (entryAmount > 0) {
      setEntryAmount(entryAmount - 1);
    }
  }

  const { data: totalEntries, isLoading: totalEntriesLoading } =
    useContractRead(contract, "totalEntries");

  const { data: lastWinner, isLoading: lastWinnerLoading } = useContractRead(contract, "lastWinner");


  if (tokenContractLoding || entryCostLoading || raffleStatusLoading || totalEntriesLoading || lastWinnerLoading) {
    return <RaffleSkeleton />;
  }


  return (
    <HStack
      w={"100%"}
      minH={"220px"}
      bg={"white"}
      textAlign={"center"}
      borderRadius={16}
      justify={"center"}
      p={8}
      flexDir={["column", null, "row"]}
      boxShadow="0px 4px 20px 0px #00CC66"
    
    >
      <Stack align={"center"}  w={['100%', null, '50%']}>
        <Heading fontSize={"50px"} color={"green"}>
          WIN THE PRIZE
        </Heading>

        {!totalEntriesLoading && (
          <Text fontSize={"32px"} fontWeight={700}>
            Total Entries: {totalEntries.toString()}
          </Text>
        )}

        <CoinsIcon />
        {!entryCostLoading && (
          <Text fontSize={"12px"} color={"black"} opacity={"54%"}>
            Cost per ticket: {entryCostInEther} ${data?.symbol}
          </Text>
        )}

        {address ? (
          <Stack>
            <HStack>
              <Button
                onClick={decreaseEntryAmount}
                background={"gray"}
                opacity={"40%"}
              >
                -
              </Button>
              <Input
                value={entryAmount}
                type={"number"}
                onChange={(e) => setEntryAmount(parseInt(e.target.value))}
                textAlign={"center"}
                mx={2}
                background={"gray"}
                opacity={"40%"}
                border={"none"}
                textColor={"black"}
              />
              <Button
                onClick={increaseEntryAmount}
                background={"gray"}
                opacity={"40%"}
              >
                +
              </Button>
            </HStack>

            <Web3Button
              style={{
                background: "yellow",
                height: "37px",
                color: "black",
                borderRadius: "10px",
                padding: "0px 30px",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
              }}
              contractAddress={LOTTERY_CONTRACT_ADDRESS}
              action={async (contract) => {
                await tokenContract?.setAllowance(
                  LOTTERY_CONTRACT_ADDRESS,
                  entryCostSubmit
                );
                await contract.call("buyEntry", [entryAmount]);
              }}
              isDisabled={!raffleStatus}
            >
              {raffleStatus ? `Buy Ticket(s)` : "Raffle it is close"}
            </Web3Button>
          </Stack>
        ) : (
          <Text>Connect your wallet</Text>
        )}

        {!raffleStatus &&
          lastWinner != "0x0000000000000000000000000000000000000000" && (
            <Text> Winner is: {lastWinner}</Text>
          )}
      </Stack>
      <Stack textAlign={"center"} w={['100%', null, '50%']} h={'100%'} alignSelf={'start'} pt={[10, null]}>
        <Text fontSize={"32px"} fontWeight={700}>
          Participants
        </Text>
        <CurrentEntries lastWinner={lastWinner} />
      </Stack>
    </HStack>
  );
};
