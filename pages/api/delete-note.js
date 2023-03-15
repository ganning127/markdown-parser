import clientPromise from "../../lib/mongodb";
import { generateSlug } from "random-word-slugs";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("markdown-parser");
  const collection = await db.collection("notes");

  const body = JSON.parse(req.body);
  const slug = body.slug;
  const noteOwner = body.noteOwner;
  const reqOwner = body.reqOwner;

  if (noteOwner !== reqOwner) {
    res.status(400).json({
      message: "Invalid action. You are not the owner of this note",
      success: false,
    });
    return;
  }

  console.log("Deleting note with slug: " + slug + " and owner: " + reqOwner);
  // you must be the owner of the note to delete it
  const resp = await collection.deleteOne({
    slug: slug,
    owner: reqOwner,
  });

  console.log(resp);

  res.status(200).json({ message: "Note deleted successfully", success: true });
}
