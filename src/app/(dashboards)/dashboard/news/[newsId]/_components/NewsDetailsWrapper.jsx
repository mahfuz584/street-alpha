import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { fetchGetById } from "../../../_components/utils";

const NewsDetailsWrapper = async ({ params }) => {
  const { newsId } = await params;
  const { data: news } = await fetchGetById("/news", newsId);

  const { image, title, date, summary, content, link, tickers } = news;
  return (
    <div className="w-full max-w-4xl m-auto p-6 xl:p-10 h-full rounded-lg bg-[#fff] border-[0.75px] border-[#DFDFE4] border-b-2 border-b-blue-600">
      <Link href={`/dashboard/analytics/${tickers[0]}`} scroll>
        <Image
          src={image}
          alt={title}
          width={260}
          height={260}
          priority
          className="object-cover mx-auto"
        />
      </Link>
      <div className="px-3 pb-4">
        <p className="text-[#070707] text-[22px] lg:text-[26px] xl:text-[32px] font-medium tracking-normal xl:tracking-[-0.72px] mb-4">
          {title}
        </p>
        <div className="flex items-center justify-between mb-6">
          <p className=" text-[#555] text-sm">
            {new Date(date).toLocaleString()}
          </p>
          <div className="flex items-center gap-2 hover:underline">
            <Link
              href={`/dashboard/analytics/${tickers[0]}`}
              className=" text-sm"
              scroll
            >
              {tickers[0]}
            </Link>
            <FiArrowRight />
          </div>
        </div>
        <p className="text-[#070707]  text-lg mb-3">Summary:</p>
        <p className="text-[#555] text-xs lg:text-base leading-normal tracking-normal mb-6 xl:tracking-[-0.42px]">
          {summary}
        </p>
        <p className="text-[#070707] font-medium mb-3">Content:</p>
        <p className="mb-6 text-gray-800 whitespace-pre-line">{content}</p>
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Source
        </Link>
      </div>
    </div>
  );
};

export default NewsDetailsWrapper;
