"use client";

import { useState } from "react";
import { createPost } from "../actions/post";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CreateNewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    caption: "",
  });
  const { isLoaded, isSignedIn, user } = useUser();

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoaded && isSignedIn) {
    return (
      <div>
        <form className="flex flex-col gap-6 w-96 mx-auto">
          <h2>New Post</h2>

          <div className="flex flex-col gap-3">
            <label htmlFor="caption">Caption:</label>
            <textarea
              className="rounded-md py-3 text-black text-sm px-3"
              name="caption"
              id="caption"
              value={formData.caption}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={async () => {
              const displayName = await createPost(formData.caption, user.id);
              router.refresh();
              router.push("/user/" + displayName);
            }}
            type="button"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}
