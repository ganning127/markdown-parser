import Head from "next/head";
import {
  Container,
  Heading,
  Box,
  Flex,
  SimpleGrid,
  Text,
  Button,
} from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>Markdown Parser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.2xl" textAlign="center">
        <Heading fontWeight="black" textAlign="center" size="2xl" my={4}>
          Markdown Parser
        </Heading>

        <SignedIn>
          <Greeting />

          <Button as="a" href="/new" bg="blue.400" color="white" mt={8}>
            Create New Note
          </Button>
        </SignedIn>
        <SignedOut>
          <Button as="a" href="/sign-in" bg="blue.400" color="white">
            Sign In
          </Button>
        </SignedOut>
      </Container>

      <Footer mt={16} />
    </>
  );
}

export const getServerSideProps = ({ req }) => {
  const { userId } = getAuth(req);
  // ...
  return { props: { ...buildClerkProps(req) } };
};

const Greeting = () => {
  // Use the useUser hook to get the Clerk.user object
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <Flex alignItems="center" justify="center">
      <Text mr={2}>Welcome back, {user.firstName}</Text>
      <UserButton />
    </Flex>
  );
};
