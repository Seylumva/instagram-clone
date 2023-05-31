# Instagram Clone

## Stack

Made with Next.js 13, experimental server actions, Cloudinary for file hosting, Clerk for authentication, PlanetScale for a cloud database and Prisma for an ORM.

[Live Vercel Deployment](https://instagram-clone-seylumva.vercel.app/)

## Self-host

Once you have successfully cloned the repository to your computer, you should run `npm install` at the root of the project before continuing.

Required environment variables:

#### Clerk

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

#### Cloudinary

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

#### Database (PlanetScale)

- `DATABASE_URL`

## Prisma Set-Up

Before your database is able to be written to and read from, you have to run the `npx prisma db push` command to sync your Prisma schema to your database tables.

## Running locally

Once you have set up all the necessary environment variables you can run `npm run dev`

## Deploy to Vercel

Remember to override Vercel's default `Build Command` on your project's settings

The command should be set to `npx prisma generate && next build` or the build process will fail.
