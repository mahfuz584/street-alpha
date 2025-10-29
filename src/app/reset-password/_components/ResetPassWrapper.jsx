import ResetPassword from "./ResetPassowrd";

const ResetPassWrapper = async ({ searchParams }) => {
  const { token } = await searchParams;

  if (!token) return <p>Invalid or missing token.</p>;

  return <ResetPassword token={token} />;
};

export default ResetPassWrapper;
