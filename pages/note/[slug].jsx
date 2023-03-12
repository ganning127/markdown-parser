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
import { Footer } from "../../components/Footer";
import { Components } from "../../components/MDXComponents";

export default function Note({ mdxString }) {
  return (
    <>
      <Container maxW="container.xl">
        <ReactMarkdown components={Components}>{mdxString}</ReactMarkdown>
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
