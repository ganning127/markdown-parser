// api needs to take the content that was sent and save it to the mongodb database

import clientPromise from "../../lib/mongodb";
import { generateSlug } from "random-word-slugs";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("markdown-parser");
  const collection = await db.collection("notes");

  // remove all documents from the collection
  await collection.deleteMany({});

  res.status(200).json({ success: true });
}
