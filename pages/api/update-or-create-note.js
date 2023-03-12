// api needs to take the content that was sent and save it to the mongodb database

import clientPromise from "../../lib/mongodb";
import { generateSlug } from "random-word-slugs";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("markdown-parser");
  const collection = await db.collection("notes");
  let currSlug = req.body.slug;

  // find the element in the db with slug
  const allData = await collection
    .find({
      slug: currSlug,
    })
    .limit(1)
    .toArray();

  if (allData.length > 0) {
    // check if the owner is the same
    if (allData[0].owner === req.body.owner) {
      // update the document
      const resp = await collection.updateOne(
        { slug: currSlug },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            updated_at: new Date(),
          },
        }
      );
      res.status(200).json({ url: currSlug, newURL: false });
    } else {
      // create new document
      let slug = generateSlug();
      let isValidSlug = await checkValidSlug(slug, collection);
      while (!isValidSlug) {
        slug = generateSlug();
        isValidSlug = await checkValidSlug(slug, collection);
      }

      const resp = await collection.insertOne({
        title: req.body.title,
        content: req.body.content,
        slug: slug,
        views: 0,
        reading_time: 43,
        created_at: new Date(),
        updated_at: new Date(),
        owner: req.body.owner,
      });

      res.status(200).json({ url: slug, newURL: true });
    }
  } else {
    // return that something went wrong
    res.status(500).json({ error: "Something went wrong" });
  }
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
