import { useRouter } from "next/router";

import {
  Box,
  Container,
  SimpleGrid,
  Textarea,
  Heading,
  Text,
  Img,
  Code,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDisclosure } from "@chakra-ui/react";
import {
  CustomHeading1,
  CustomHeading2,
  CustomHeading3,
  CustomImage,
  CustomParagraph,
  CustomCode,
} from "../components/MDXComponents";

const components = {
  h1: CustomHeading1,
  h2: CustomHeading2,
  h3: CustomHeading3,
  img: CustomImage,
  p: CustomParagraph,
  code: CustomCode,
};

export default function Home() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onShare = async () => {
    onOpen();
    setUrl("");

    // call api to save note
    // return id
    // return url

    const endpoint = "/api/create-note";
    const data = { content: content };
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
      <Container maxW="container.2xl">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontWeight="black" textAlign="center" size="2xl" my={4}>
            Markdown Editor
          </Heading>

          <Button onClick={onShare} bg="blue.400" color="white">
            Share Note
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} height="100vh">
          <Box>
            <Textarea
              border="2px solid gray"
              value={content}
              rounded="md"
              height="100vh"
              placeholder="# type your markdown here"
              onChange={(e) => setContent(e.target.value)}
            />
          </Box>
          <Box>
            <ReactMarkdown components={components}>
              {content ? content : "preview will appear here"}
            </ReactMarkdown>
          </Box>
        </SimpleGrid>
      </Container>

      {/* SHARE BUTTON */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4}>
            <Box mb={4}>
              <Text fontWeight="bold">Share Note</Text>
              <Text fontSize="md" fontWeight="thin">
                Share this link with your friends!
              </Text>
            </Box>
            <ModalCloseButton />
            <Text bg="gray.100" py={1} px={2} rounded="true">
              {"https://markdown-parser-roan.vercel.app/"}
              note/
              {url ? url : "loading..."}
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
