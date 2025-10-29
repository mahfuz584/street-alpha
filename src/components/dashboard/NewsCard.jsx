import Image from "next/image";
import Link from "next/link";

const NewsCard = ({ data }) => {
  const { id, title, image, summary } = data;
  return (
    <>
      <Link
        href={`/dashboard/news/${id}`}
        className="rounded-sm bg-[#fff] border-[0.75px] border-[#DFDFE4]"
      >
        <Image
          src={image}
          alt={title}
          width={334}
          height={270}
          className="object-cover"
        />
        <div className="text-[#070707] lg:text-lg font-semibold tracking-normal xl:tracking-[-0.72px] mb-3 line-clamp-2 mt-5 px-4">
          {title}
        </div>
        <div className="news-desc text-[#555] text-[13px] lg:text-[14px] leading-normal tracking-normal xl:tracking-[-0.42px] px-4 mb-6">
          {summary}
        </div>
      </Link>
    </>
  );
};

export default NewsCard;
