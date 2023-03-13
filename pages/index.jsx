import Head from "next/head";
import {
  Container,
  Heading,
  Box,
  Flex,
  SimpleGrid,
  Text,
  HStack,
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
import { NavBar } from "../components/NavBar";
export default function Home(props) {
  return (
    <>
      <Head>
        <title>Markdown Parser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />
      <Container maxW="container.xl" textAlign="center" mt={24}>
        <Box mb={8}>
          <Heading
            fontWeight="black"
            textAlign="center"
            fontSize={{ base: "4xl", lg: "6xl" }}
            my={4}
            lineHeight={1.2}
          >
            The easiest way to share
            <br />
            <Text
              as="span"
              bgGradient="linear(to-l, blue.400, purple.400)"
              bgClip="text"
            >
              markdown files
            </Text>
            .
          </Heading>

          <Text color="gray.400" fontSize="xl" maxW="500px" mx="auto">
            Markdown Parser is an markdown editor to create, share, and publish
            markdown documents, all in{" "}
            <Text as="span" fontWeight="bold">
              your browser
            </Text>
            .
          </Text>
        </Box>
        <Box>
          <HStack justifyContent="center">
            <Button
              as="a"
              href="https://github.com/ganning127/markdown-parser"
              color="blue.400"
              bg=""
              // size="lg"
              fontWeight="bold"
              rounded="md"
              px={4}
              py={6}
              fontSize="lg"
              target="_blank"
            >
              GitHub
            </Button>

            <Button
              as="a"
              fontSize="lg"
              href="/sign-in"
              bg="blue.400"
              color="white"
              // size="lg"
              fontWeight="bold"
              rounded="md"
              px={4}
              py={6}
              _hover={{
                bg: "blue.500",
              }}
            >
              Get Started
            </Button>
          </HStack>
        </Box>
      </Container>

      <Footer mt={48} />
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
