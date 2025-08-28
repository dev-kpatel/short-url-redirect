import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLHeadingElement> & {
  title?: string;
};
export const Header = ({ className, title = "Dashboard", ...props }: Props) => {
  return (
    <header className="relative after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-gray/10">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
    </header>
  );
}
