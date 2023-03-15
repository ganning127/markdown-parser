import Head from "next/head";
import { useRouter } from "next/router";

import clientPromise from "../../lib/mongodb";
import { Button, Container, Flex } from "@chakra-ui/react";
// import { Components } from "../../components/MDXComponents";
import { Heading, Text } from "@chakra-ui/react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function Note({ title, updated_at, mdxString }) {
  const router = useRouter();

  console.log(router.query);
  return (
    <>
      <Head>
        <title>{title + " | Markdown Parser"}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.xl" p={4}>
        <Flex justify="space-between" alignItems="center">
          <Heading>{title}</Heading>
          <Button
            mt={4}
            colorScheme="blue"
            as="a"
            href={"/note/" + router.query.slug + "/edit"}
          >
            Edit Note
          </Button>
        </Flex>
        <Text my={4}>Last Updated: {updated_at}</Text>
        <MDEditor
          value={mdxString}
          data-color-mode="light"
          preview="preview"
          height="80vh"
        />
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
        title: data.title,
        updated_at: data.updated_at.toLocaleDateString(),
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
