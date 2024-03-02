import {
  ConnectWallet,
  embeddedWallet,
  smartWallet,
  useConnect,
  useEmbeddedWallet,
} from "@thirdweb-dev/react";
import { useState } from "react";
import { ACCOUNT_FACTORY_ADDRESS } from "../constants/addresses";
import {
  Button,
  Heading,
  Input,
  Link,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function EmailSignIn() {
  const [state, setState] = useState<
    "init" | "sending_email" | "email_verification" | "connected"
  >("init");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  const { connect, sendVerificationEmail } = useEmbeddedWallet();

  const connectSmartWallet = useConnect();
  const smartWalletConfig = smartWallet(embeddedWallet(), {
    factoryAddress: ACCOUNT_FACTORY_ADDRESS,
    gasless: true,
  });

  const handleEmailEntered = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    setState("sending_email");
    await sendVerificationEmail({ email });
    setState("email_verification");
  };

  const handleEmailVerification = async () => {
    if (!email || !verificationCode) {
      alert("Please enter an verification code");
      return;
    }
    try {
      const personalWallet = await connect({
        strategy: "email_verification",
        email,
        verificationCode,
      });
      const smartWallet = await connectSmartWallet(smartWalletConfig, {
        personalWallet: personalWallet,
        chainId: 11155111,
      });
      const isDeployed = await smartWallet.isDeployed();
      if (!isDeployed) {
        await smartWallet.deploy();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (state === "sending_email") {
    return (
      <Stack>
        <Progress size="xs" isIndeterminate />
        <Text>Sending OTP email...</Text>
      </Stack>
    );
  }

  if (state === "email_verification") {
    return (
      <Stack>
        <Heading>Enter the verification code sent to your email</Heading>
        <Input
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <Button onClick={handleEmailVerification}>Verify</Button>
        <Link onClick={() => setState("init")}>Go Back</Link>
      </Stack>
    );
  }

  return <ConnectWallet />;
}
