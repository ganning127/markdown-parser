import Head from "next/head";
import clientPromise from "../lib/mongodb";

import {
  Container,
  Heading,
  Box,
  Flex,
  SimpleGrid,
  Link,
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
import { SimpleSidebar } from "../components/Sidebar";

export default function Home(props) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Markdown Parser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SimpleSidebar>
        <Container maxW="container.2xl" textAlign="center">
          <Heading fontWeight="black" textAlign="center" size="2xl" my={4}>
            Welcome back,{" "}
            <Text as="span" color="blue.600">
              {user.firstName}
            </Text>
            .
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} mt={8}>
            {props.notes.map((note) => (
              <Link
                key={note._id}
                href={`/note/${note.slug}`}
                _hover={{}}
                isExternal
              >
                <Box
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{
                    bg: "blue.50",
                  }}
                >
                  {note.content.slice(0, 50)}
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Container>
      </SimpleSidebar>

      <Footer mt={16} />
    </>
  );
}

export const getServerSideProps = async ({ req }) => {
  try {
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    const { userId } = await getAuth(req);
    console.log("USERID:", userId);

    const client = await clientPromise;
    const db = await client.db("markdown-parser");
    const collection = await db.collection("notes");

    const notes = await collection
      .find({
        owner: userId,
      })
      .toArray();

    const data = JSON.parse(JSON.stringify(notes));

    return {
      props: {
        notes: data,
        success: true,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: { success: false },
    };
  }
};
