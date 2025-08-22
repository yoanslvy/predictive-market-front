/* eslint-disable @next/next/no-img-element */
// import getPostData from "@/lib/getPostData";
// import getReadingTime from "@/lib/getReadingTime";
// import getRelativeDate from "@/lib/getRelativeDate";
import { ImageResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export const size = {
  width: 1200,
  height: 630,
};
export const alt = "UNCX Network";
export const contentType = "image/png";

// const interSemiBold = fetch(
//   new URL('/public/fonts/Inter-SemiBold.ttf', import.meta.url)
// ).then((res) => res.arrayBuffer())
// const fontPath = 
const interRegular = fs.readFile(path.join(process.cwd(), '/public/fonts/Inter-Regular.ttf'));
const interMedium = fs.readFile(path.join(process.cwd(), '/public/fonts/Inter-Medium.ttf'));
const interSemiBold = fs.readFile(path.join(process.cwd(), '/public/fonts/Inter-SemiBold.ttf'));
const interBold = fs.readFile(path.join(process.cwd(), '/public/fonts/Inter-Bold.ttf'));
const interBlack = fs.readFile(path.join(process.cwd(), '/public/fonts/Inter-Black.ttf'));


export default async function og(
  // { params }: { params: { slug: string } }
) {
  // const slug = params.slug;
  // const post = await getPostData(slug);

  // const interBoldFontData = await interSemiBold

  // return new ImageResponse(
  //   (

  //     <div tw="relative bg-black flex w-full h-full flex items-center">
  //       {/* Background */}
  //       <div tw="absolute flex inset-0">
  //         <img
  //           tw="flex h-screen -ml-[800px] -mr-[800px] flex-1 bg-black opacity-50"
  //           src="https://image.mux.com/01dJc02gTKO01eAAQnLWWu8vfQ01XEBu2aRIjsXBladlxe8/thumbnail.png?width=1200&height=2400&time=0"
  //           alt={"UNCX Lock Icon"}
  //         />
  //         {/* Overlay */}
  //         <div tw="absolute flex inset-0" />
  //       </div>
  //       <img
  //           tw="flex h-24 w-24"
  //           height={64}
  //           width={64}
  //           src="http://localhost:3000/public/brand/uncx-logo-solo-brand-logo.png"
  //           alt={"UNCX Lock Icon"}
  //         />
  //       <div tw="flex flex-col text-neutral-50 bg-gray-800 px-12 py-10 rounded-3xl">
  //         {/* Title */}
  //         <div style={{ fontFamily: 'InterBlack' }} tw="text-7xl font-InterSemiBold text-green-500">
  //           {/* {post?.title} */}
  //           UNCX Lockers V3
  //         </div>
  //         {/* Tags */}
  //         <div tw="flex mt-6 flex-wrap text-4xl text-neutral-200">
  //           {/* <div
  //             tw={`font-medium ${
  //               post?.category.title === "Cities"
  //                 ? "text-emerald-600"
  //                 : "text-indigo-600"
  //             }`}
  //           >
  //             {post?.category.title}
  //           </div> */}
  //           {/* <div tw="w-4 h-4 mx-6 rounded-full bg-neutral-300 " /> */}
  //           {/* <div>{post?.author.full_name}</div> */}
  //           {/* <div tw="w-4 h-4 mx-6 rounded-full bg-neutral-300" /> */}
  //           <div>
  //             {/* {getReadingTime(post?.body!!)} */}
  //             {/* Test */}
  //           </div>
  //           {/* <div tw="w-4 h-4 mx-6 rounded-full bg-neutral-300" /> */}

  //           <div>
  //             {/* {getRelativeDate(post?.date_created!!)} */}
  //             {`Vest Your Uniswap V3 NFTs`}

  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   ),
  //   {
  //     // For convenience, we can re-use the exported opengraph-image
  //     // size config to also set the ImageResponse's width and height.
  //     ...size,
  //     fonts: [
  //       {
  //         name: 'InterRegular',
  //         data: await interRegular,
  //         // weight: 400,
  //       },
  //       {
  //         name: 'InterMedium',
  //         data: await interMedium,
  //         // weight: 500,
  //       },
  //       {
  //         name: 'InterSemiBold',
  //         data: await interSemiBold,
  //         // weight: 600,
  //       },
  //       {
  //         name: 'InterBold',
  //         data: await interBold,
  //         // weight: 700,
  //       },
  //       {
  //         name: 'InterBlack',
  //         data: await interBlack,
  //         // weight: 800,
  //       },
  //     ],
  //   }

  // );
}