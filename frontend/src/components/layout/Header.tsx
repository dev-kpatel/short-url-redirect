import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLHeadingElement> & {
  title?: string;
};
export const Header = ({ className, title = "Dashboard", ...props }: Props) => {
  return (
    <header className="border-b border-border bg-card/20 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">{title}</h1>
      </div>
    </header>
  );
}
