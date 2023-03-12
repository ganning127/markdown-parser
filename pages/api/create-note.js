// api needs to take the content that was sent and save it to the mongodb database

import clientPromise from "../../lib/mongodb";
import { generateSlug } from "random-word-slugs";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("markdown-parser");
  const collection = await db.collection("notes");
  const slug = generateSlug();

  const resp = await collection.insertOne({
    content: req.body.content,
    slug: slug,
    views: 0,
    reading_time: 43,
    created_at: new Date(),
    owner: "",
  });

  res.status(200).json({ url: slug });
}
