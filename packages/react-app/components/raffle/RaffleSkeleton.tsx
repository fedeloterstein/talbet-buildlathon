import { Skeleton } from "@chakra-ui/react";
import React from "react";

export const RaffleSkeleton = () => {
  return (
    <Skeleton
      w={"100%"}
      h={"400px"}
      borderRadius={16}
      startColor="yellow"
      endColor="black"
    />
  );
};
