import PublicPhoto from "./PublicPhoto";

export default function AuthSplit({ children }) {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col bg-white lg:flex-row">
      <PublicPhoto
        kind="auth"
        priority
        className="h-44 w-full shrink-0 sm:h-56 lg:h-auto lg:min-h-[calc(100dvh-4rem)] lg:w-[40%]"
      />
      <div className="flex w-full flex-1 justify-center px-5 py-8 sm:px-10 lg:w-[60%] lg:items-center lg:px-16 lg:py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
