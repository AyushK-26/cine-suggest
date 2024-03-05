import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="flex flex-col justify-center items-center h-screen bg-neutral-900 text-gray-200"
    >
      <div className="flex flex-col justify-center items-center gap-4 p-6 bg-red-800 rounded-lg">
        <h1 className="text-6xl font-semibold">Oops!</h1>
        <p className="text-3xl">Sorry, an unexpected error has occurred.</p>
        <p className="font-semibold">
          <i>{error.statusText || error.message}</i>
        </p>
        <Link to="/" className="underline">
          Navigate to Home
        </Link>
      </div>
    </div>
  );
}
