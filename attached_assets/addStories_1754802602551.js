// src/utils/addStories.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const uploadStories = async (stories = []) => {
  const storiesRef = collection(db, "inspirationStories");

  for (let story of stories) {
    try {
      await addDoc(storiesRef, {
        title: story.title,
        summary: story.short,
        image: story.image,
        fullStory: story.full,
        createdAt: serverTimestamp(),
      });
      console.log(`✅ Uploaded: ${story.title}`);
    } catch (err) {
      console.error("❌ Error adding story:", err);
    }
  }
};
