import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="text-center">
      <h2 className="mb-6 text-2xl font-semibold">
        Sorry, this page isn't available
      </h2>
      <p className="text-lg">
        The link you followed may be broken, or the page may have been removed.{" "}
        <Link href="/" className="text-slate-300">
          Go back to the home page.
        </Link>
      </p>
    </div>
  );
}
