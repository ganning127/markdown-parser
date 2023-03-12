// api needs to take the content that was sent and save it to the mongodb database

import clientPromise from "../../lib/mongodb";
import { generateSlug } from "random-word-slugs";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("markdown-parser");
  const collection = await db.collection("notes");
  let slug = "burly-melted-russia";

  // check if slug is already in mongodb
  let isValidSlug = await checkValidSlug(slug, collection);
  while (!isValidSlug) {
    slug = generateSlug();
    isValidSlug = await checkValidSlug(slug, collection);
  }

  const resp = await collection.insertOne({
    content: req.body.content,
    slug: slug,
    views: 0,
    reading_time: 43,
    created_at: new Date(),
    owner: req.body.owner,
  });

  res.status(200).json({ url: slug });
}

async function checkValidSlug(slug, collection) {
  const allData = await collection
    .find({
      slug: slug,
    })
    .limit(1)
    .toArray();

  if (allData.length > 0) {
    return false;
  } else {
    return true;
  }
}
