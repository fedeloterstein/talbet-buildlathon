import { Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { LogoBigIcon } from "./icons/LogoBigIcon";

export const Landing = () => {
  return (
    <Stack align={"center"} justify={"center"} w={"100%"} h={"100vh"} gap={10}>
      <LogoBigIcon />
      <Heading fontSize={"50px"} color={"yellow"} textAlign={"center"}>
        Play, Bet, and Win with $cTAL
      </Heading>
    </Stack>
  );
};
