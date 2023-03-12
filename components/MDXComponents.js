import { Heading, Text, Img, Code, Flex, Button } from "@chakra-ui/react";

export const CustomHeading1 = (props) => {
  return <Heading size="xl" fontWeight="extrabold" {...props} />;
};

export const CustomHeading2 = (props) => {
  return <Heading size="lg" {...props} />;
};

export const CustomHeading3 = (props) => {
  return <Heading size="md" {...props} />;
};

export const CustomImage = (props) => {
  return <Img {...props} />;
};

export const CustomParagraph = (props) => {
  return <Text fontSize="md" {...props} />;
};

export const CustomCode = (props) => {
  return <Code colorScheme="blue" fontSize="md" {...props} />;
};

export const Components = {
  h1: CustomHeading1,
  h2: CustomHeading2,
  h3: CustomHeading3,
  img: CustomImage,
  p: CustomParagraph,
  code: CustomCode,
};
