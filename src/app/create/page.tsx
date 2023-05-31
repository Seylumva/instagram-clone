"use client";

import { useState } from "react";
import { createPost } from "../actions/post";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CreateNewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    caption: "",
    files: [],
  });
  const { isLoaded, isSignedIn, user } = useUser();

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddImage = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      files: [...prevState.files, ...e.target.files],
    }));
  };

  const uploadListingPictures = async (images) => {
    try {
      const formData = new FormData();
      const listingImages = [];
      for (let image of images) {
        formData.append("file", image);
        formData.append("upload_preset", "ig-clone");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/seylumva/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.error) {
          throw new Error("Wrong file type.");
        }
        listingImages.push(data.secure_url);
      }
      return listingImages;
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoaded && isSignedIn) {
    return (
      <div>
        <form
          className="mx-auto flex w-96 flex-col gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const files = await uploadListingPictures(formData.files);
            const displayName = await createPost({
              ...formData,
              files,
              userId: user.id,
            });
            router.refresh();
            router.push("/user/" + displayName);
          }}
        >
          <h2>New Post</h2>

          <div className="flex flex-col gap-3">
            <label htmlFor="caption">Caption:</label>
            <textarea
              className="rounded-md px-3 py-3 text-sm text-black"
              name="caption"
              id="caption"
              value={formData.caption}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="files">
              Files:
              <div className="mt-3 rounded-md bg-blue-500 py-2 text-center hover:cursor-pointer hover:bg-blue-600">
                Select files...
              </div>
            </label>
            <input
              type="file"
              className="hidden rounded-md px-3 py-3 text-sm text-black"
              name="files"
              id="files"
              multiple
              onChange={handleAddImage}
            />
          </div>
          <button className="rounded-md bg-slate-600 py-2 transition hover:bg-slate-700">
            Submit
          </button>
        </form>
      </div>
    );
  }
}
