import Helmet from "react-helmet";
import AppBar from "./Appbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
}

export const Layout = ({
  children,
  title,
  description,
  keywords,
  author,
}: LayoutProps) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <div>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
        </div>
        <title>{title}</title>
      </Helmet>
      <AppBar />

      <main className="bg-gray-300 min-h-screen">{children}</main>
    </div>
  );
};
