import { Skeleton} from "@chakra-ui/react";
import React from "react";

export const WalletSkeleton = () => {
  return (
    <Skeleton
      w={"100%"}
      h={"230px"}
      borderRadius={16}
      p={4}
      gap={16}
      startColor="yellow"
      endColor="black"
    />
  );
};
