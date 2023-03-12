import { Divider, Text, Box } from "@chakra-ui/react";

export const Footer = (props) => {
  return (
    <Box as="footer" {...props}>
      <Divider my={4} />
      <Text textAlign="center" fontSize="sm">
        Made with ❤️ by Ganning Xu in {new Date().getFullYear()}.
      </Text>
    </Box>
  );
};
