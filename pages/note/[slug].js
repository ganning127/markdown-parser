import ReactMarkdown from "react-markdown";
import clientPromise from "../../lib/mongodb";
import { useRouter } from "next/router";
import {
  CustomHeading1,
  CustomHeading2,
  CustomHeading3,
  CustomImage,
  CustomParagraph,
  CustomCode,
} from "../../components/MDXComponents";
import { Container } from "@chakra-ui/react";

const components = {
  h1: CustomHeading1,
  h2: CustomHeading2,
  h3: CustomHeading3,
  img: CustomImage,
  p: CustomParagraph,
  code: CustomCode,
};

export default function Note({ mdxString }) {
  const router = useRouter();
  const { type } = router.query;

  return (
    <>
      <Container maxW="container.xl">
        <ReactMarkdown components={components}>{mdxString}</ReactMarkdown>
      </Container>
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
