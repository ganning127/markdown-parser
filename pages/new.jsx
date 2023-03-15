import Head from "next/head";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

import {
  Box,
  Container,
  SimpleGrid,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDisclosure } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { SimpleSidebar } from "../components/Sidebar";

export default function Home() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoaded, isSignedIn, user } = useUser();

  const onShare = async () => {
    onOpen();
    setUrl("");

    const endpoint = "/api/create-note";
    let noteTitle = title;
    if (noteTitle === "") {
      noteTitle = "Untitled Note";
    }
    const data = {
      content: content,
      owner: user.id,
      title: noteTitle,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(endpoint, options);
    const json = await res.json();
    setUrl(json.url);
  };

  return (
    <>
      <Head>
        <title>
          {title
            ? title + " | Markdown Parser"
            : "Untitled Note" + " | Markdown Parser"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SimpleSidebar>
        <Container maxW="container.2xl">
          <Flex alignItems="center" justifyContent="space-between">
            {/* <Heading fontWeight="black" textAlign="center" size="2xl" my={4}>
              Markdown Editor
            </Heading> */}

            <Input
              placeholder="Untitled Note"
              value={title}
              fontWeight="black"
              // textAlign="center"
              // size="2xl"
              maxW="300px"
              onChange={(e) => setTitle(e.target.value)}
              size="lg"
              my={4}
            />

            <Button
              onClick={onShare}
              bg="blue.400"
              color="white"
              _hover={{
                bg: "blue.600",
              }}
            >
              <Text>Share Note</Text>
            </Button>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={10} height="100vh">
            <Box>
              <MDEditor
                value={content}
                onChange={setContent}
                data-color-mode="light"
                preview="live"
                height="80vh"
              />

              {/* <Textarea
                value={content}
                rounded="md"
                height="100vh"
                placeholder="# type your markdown here"
                onChange={(e) => setContent(e.target.value)}
              /> */}
            </Box>
          </SimpleGrid>
        </Container>
      </SimpleSidebar>

      {/* <Footer /> */}

      {/* SHARE BUTTON */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4}>
            <Box mb={4}>
              <Text fontWeight="bold">Share Note</Text>
              <Text fontSize="md" fontWeight="thin">
                Share this unique link with your friends!
              </Text>
            </Box>
            <ModalCloseButton />
            {url ? (
              <>
                <Text bg="gray.100" py={1} px={2} rounded="md">
                  {"https://markdown-parser-roan.vercel.app/"}
                  note/
                  {url}
                </Text>
                <Button
                  mt={4}
                  py={0}
                  colorScheme="blue"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "https://markdown-parser-roan.vercel.app/" + "note/" + url
                    )
                  }
                >
                  Copy
                </Button>
              </>
            ) : (
              <Spinner />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// export async function getStaticProps() {
//   // MDX text - can be from a local file, database, anywhere

//   return { props: { source: mdxSource } };
// }

// export async function getServerSideProps(context) {
//   try {
//     await clientPromise;
//     // `await clientPromise` will use the default database passed in the MONGODB_URI
//     // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
//     //
//     // `const client = await clientPromise`
//     // `const db = client.db("myDatabase")`
//     //
//     // Then you can execute queries against your database like so:
//     // db.find({}) or any of the MongoDB Node Driver commands

//     return {
//       props: { isConnected: true },
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: { isConnected: false },
//     };
//   }
// }
