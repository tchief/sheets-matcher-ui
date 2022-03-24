import Head from 'next/head';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
}

const DEFAULT_TITLE = 'Match My Sheets';
export default function Layout({ children, title = DEFAULT_TITLE }: Props) {
  return (
    <div>
      <Head>
        <title>{title ?? DEFAULT_TITLE}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </div>
  );
}
