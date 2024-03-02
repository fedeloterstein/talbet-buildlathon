import { Button, Container, Flex } from "@chakra-ui/react";
import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import { LogoIcon } from "./icons/LogoIcon";

export const Navbar = () => {
  const address = useAddress();

  const disconnect = useDisconnect();

  if (!address) {
    return null;
  }
  return (
    <Container maxW={"1440px"} py={8}>
      <Flex
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingX={8}
        paddingY={15}
      >
        <Link href={"/"}>
          <LogoIcon />
        </Link>
        <Flex flexDirection={"row"} alignItems={"center"}>
          {address ? (
            <Button
              onClick={async () => {
                await disconnect();
              }}
              variant={"talbet"}
            >
              Sign Out
            </Button>
          ) : (
            <ConnectWallet />
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
