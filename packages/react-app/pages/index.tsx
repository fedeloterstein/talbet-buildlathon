import { Connected } from "@/components/Connected";
import { Landing } from "@/components/Landing";
import { Container, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  const images = [
    "/images/mobile.png",
    "/images/tablet.png",
    "/images/dashboard.png",
  ];
  return (
    <Stack
      backgroundImage={images}
      bgRepeat='no-repeat'
      bgSize="cover"
      bgPosition="center"
      backgroundColor={"black"}
      h={"fit-content"}
      minH={"100vh"}
      pb={10}
    >
      <Container maxW="container.lg">
        {address ? <Connected /> : <Landing />}
      </Container>
    </Stack>
  );
}
