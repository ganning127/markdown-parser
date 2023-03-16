import {
  Heading,
  Link,
  Box,
  Flex,
  Text,
  IconButton,
  Spinner,
  Badge,
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
  visibility,
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

  let displayStr = "";
  let date = new Date(updated_at);
  let today = new Date();
  let diff = today - date;

  let seconds = Math.floor(diff / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  console.log(days, hours, minutes, seconds);
  if (days > 1) {
    displayStr = `${days} days ago`;
  } else if (hours > 1) {
    displayStr = `${hours} hours ago`;
  } else if (minutes > 1) {
    displayStr = `${minutes} minutes ago`;
  } else {
    displayStr = `${seconds} seconds ago`;
  }

  console.log(diff);

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

              <Badge colorScheme={visibility === "public" ? "blue" : "purple"}>
                {visibility}
              </Badge>
            </Flex>

            <Text>{content.slice(0, 50)}</Text>
          </Link>

          <Flex justifyContent="space-between" alignItems="center">
            <Text color="gray.400" my={2}>
              {displayStr}
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
