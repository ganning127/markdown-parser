import {
  Heading,
  Link,
  Box,
  Flex,
  Text,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";

export const NoteCard = ({
  _id,
  slug,
  title,
  updated_at,
  content,
  noteOwner,
  reqOwner,
}) => {
  const [display, setDisplay] = useState("block");
  const [loading, setLoading] = useState(false);
  const deleteNote = async () => {
    setLoading(true);
    console.log(_id, slug, reqOwner, noteOwner);
    const res = await fetch(`/api/delete-note`, {
      method: "POST",
      body: JSON.stringify({
        _id: _id,
        slug: slug,
        reqOwner: reqOwner,
        noteOwner: noteOwner,
      }),
    });

    const data = await res.json();
    console.log(data);

    if (data.success) {
      setDisplay("none");
    }

    setLoading(false);
  };

  return (
    <>
      <Box>
        <Box
          py={2}
          px={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          display={display}
        >
          <Link
            key={_id}
            href={`/note/${slug}`}
            // _hover={{}}
            isExternal
            _hover={{
              bg: "blue.50",
            }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="md" fontWeight="black">
                {title}
              </Heading>
            </Flex>

            <Text>{content.slice(0, 50)}</Text>
          </Link>

          <Flex justifyContent="space-between" alignItems="center">
            <Text color="gray.400" my={2}>
              {new Date(updated_at).toLocaleString()}
            </Text>

            <IconButton
              colorScheme="red"
              onClick={deleteNote}
              mt={4}
              size="sm"
              variant="outline"
              icon={loading ? <Spinner /> : <HiOutlineTrash />}
              _hover={{
                bg: "red.50",
              }}
            >
              {/* {loading ? <Spinner /> : "Delete"} */}
            </IconButton>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
