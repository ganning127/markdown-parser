import ReactMarkdown from "react-markdown";
import clientPromise from "../../../lib/mongodb";
import { useRouter } from "next/router";
import {
  CustomHeading1,
  CustomHeading2,
  CustomHeading3,
  CustomImage,
  CustomParagraph,
  CustomCode,
} from "../../../components/MDXComponents";
import { Components } from "../../../components/MDXComponents";
import { useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Textarea,
  Heading,
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
  useDisclosure,
} from "@chakra-ui/react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { SimpleSidebar } from "../../../components/Sidebar";
import { Footer } from "../../../components/Footer";

export default function Note({ mdxString, noteTitle }) {
  const [content, setContent] = useState(mdxString);
  const [title, setTitle] = useState(noteTitle);
  const [newURL, setNewURL] = useState(false);
  const [url, setUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();
  console.log(router.query.slug);
  const onShare = async () => {
    onOpen();
    setUrl("");

    const endpoint = "/api/update-or-create-note";
    let noteTitle = title;
    if (noteTitle === "") {
      noteTitle = "Untitled Note";
    }
    const data = {
      content: content,
      owner: user.id,
      title: noteTitle,
      slug: router.query.slug,
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

    console.log(json);
    setNewURL(json.newURL);
  };

  return (
    <>
      <SimpleSidebar>
        <Container maxW="container.2xl">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading fontWeight="black" textAlign="center" size="2xl" my={4}>
              Markdown Editor
            </Heading>

            <Button onClick={onShare} bg="blue.400" color="white">
              <Text mr={4}>Share Note</Text>
              <UserButton />
            </Button>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} height="100vh">
            <Box>
              <Input
                placeholder="Untitled Note"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="lg"
                mb={4}
              />
              <Textarea
                value={content}
                rounded="md"
                height="100vh"
                placeholder="# type your markdown here"
                onChange={(e) => setContent(e.target.value)}
              />
            </Box>
            <Box>
              <ReactMarkdown components={Components}>
                {content ? content : "preview will appear here"}
              </ReactMarkdown>
            </Box>
          </SimpleGrid>
        </Container>
      </SimpleSidebar>

      <Footer />

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

                {newURL ? (
                  <Text fontSize="sm" fontWeight="thin" color="gray.500" mt={2}>
                    Since you're not the owner of the note, the edited note has
                    been saved as a new note.
                  </Text>
                ) : null}
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

export async function getServerSideProps(context) {
  try {
    const slug = context.params.slug;

    const client = await clientPromise;

    const db = await client.db("markdown-parser");
    const collection = await db.collection("notes");

    // get data from database about carbon monoxide
    const allData = await collection
      .find({
        slug: slug,
      })
      .limit(1)
      .toArray();

    const data = allData[0];

    return {
      props: {
        mdxString: data.content,
        noteTitle: data.title,
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { success: false },
    };
  }
}