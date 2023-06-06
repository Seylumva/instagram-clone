"use client";

// TODO: Implement image upload through backend.
// Convert images to base64 and upload through Cloudinary's Node SDK
// Only create post once images are uploaded.

import { ChangeEvent, useState } from "react";
import { createPost } from "../actions/createPost";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export default function CreateNewPostPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    caption: "",
    files: [],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files || e.target.files.length === 0) {
      // you can display the error to the user
      console.error("Select a file");
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      files: [...prev.files, ...(e.target.files as any)],
    }));
  };

  const uploadListingPictures = async (images: File[]) => {
    try {
      const formData = new FormData();
      const listingImages = [];
      for (let image of images) {
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        console.log(data);
        if (data.error) {
          throw new Error("Wrong file type.");
        }
        listingImages.push({ url: data.secure_url, publicId: data.public_id });
      }
      return listingImages;
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoaded) {
    return <>Loading...</>;
  }

  if (isLoaded && isSignedIn) {
    return (
      <div>
        <form
          className="mx-auto flex w-96 flex-col gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const files = await uploadListingPictures(formData.files);
            if (!user.id || !files) return;
            await createPost({
              ...formData,
              files,
              userId: user.id,
            });
            router.refresh();
            router.push("/user/" + user.username);
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
              onChange={(e) => handleInputChange(e)}
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
              accept=".gif,.jpg,.jpeg,.png,.webp"
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
