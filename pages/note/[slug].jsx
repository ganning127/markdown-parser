import Head from "next/head";
import { useRouter } from "next/router";

import clientPromise from "../../lib/mongodb";
import { Button, Container, Flex, Link } from "@chakra-ui/react";
// import { Components } from "../../components/MDXComponents";
import { Heading, Text } from "@chakra-ui/react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
import { getAuth } from "@clerk/nextjs/server";

export default function Note({
  visibility,
  title,
  updated_at,
  mdxString,
  success,
  views,
}) {
  const router = useRouter();

  if (!success) {
    return (
      <>
        <Head>
          <title>Uh oh!</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Container maxW="container.xl" p={4}>
          <Heading my={4}>Argh! Something went wrong.</Heading>
          <Text>
            Either you don&apos;t have access to this page, or it doesn&apos;t
            exist. Try going back to the{" "}
            <Link href="/" color="blue.400">
              home page
            </Link>
            .
          </Text>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title + " | Markdown Parser"}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content={mdxString} />
      </Head>
      <Container maxW="container.xl" p={4}>
        <Flex justify="space-between" alignItems="center">
          <Heading color="blue.400">{title}</Heading>
          <Button
            mt={4}
            colorScheme="blue"
            as="a"
            href={"/note/" + router.query.slug + "/edit"}
          >
            Edit Note
          </Button>
        </Flex>
        <Text my={4}>
          {visibility === "public" && (
            <>
              <b>{views} views</b> {"  •  "}
            </>
          )}{" "}
          Note Updated: {updated_at}
        </Text>
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

export const getServerSideProps = async (context) => {
  try {
    const { userId } = await getAuth(context.req);
    const slug = context.params.slug;
    const client = await clientPromise;
    const db = await client.db("markdown-parser");
    const collection = await db.collection("notes");
    let views = 0;
    let access = false;

    // get data from database about carbon monoxide
    const allData = await collection
      .find({
        slug: slug,
      })
      .limit(1)
      .toArray();

    const data = allData[0];

    if (data.visibility != "public") {
      console.log(data.owner, userId);
      if (data.owner == userId) {
        access = true;
      } else {
        return {
          props: {
            success: false,
          },
        };
      }
    } else {
      views = data.views;
      await collection.updateOne(
        { slug: slug },
        {
          $set: {
            views: views + 1,
          },
        }
      );
    }

    return {
      props: {
        title: data.title,
        updated_at: data.updated_at.toLocaleDateString(),
        mdxString: data.content,
        success: true,
        views: views,
        visibility: data.visibility,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { success: false },
    };
  }
};
