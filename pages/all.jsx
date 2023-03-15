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
} from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import { useUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { SimpleSidebar } from "../components/Sidebar";

export default function Home(props) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // sort notes by updated_at in descending order
  props.notes.sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  return (
    <>
      <Head>
        <title>All Notes | Markdown Parser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SimpleSidebar>
        <Container maxW="container.2xl">
          <Heading fontWeight="black" textAlign="center" size="2xl" my={4}>
            Welcome back,{" "}
            <Text as="span" color="blue.600">
              {user.firstName}
            </Text>
            .
          </Heading>

          <Heading fontWeight="bolder" size="md" mt={8} color="blue.600">
            All Notes <Text as="span">({props.notes.length})</Text>
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} mt={4}>
            {props.notes.map((note) => (
              <Link
                key={note._id}
                href={`/note/${note.slug}`}
                _hover={{}}
                isExternal
              >
                <Box
                  py={3}
                  px={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{
                    bg: "blue.50",
                  }}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md" fontWeight="black">
                      {note.title}
                    </Heading>

                    <Text color="gray.400" my={2}>
                      {new Date(note.updated_at).toLocaleString()}
                    </Text>
                  </Flex>

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
