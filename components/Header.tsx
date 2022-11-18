import { css } from '@emotion/react';
import Link from 'next/link';
import Router from 'next/router';

const headerContainerStyles = css`
  @media (max-width: 700px) {
    background-color: lightgrey;
    margin: 0;
    height: 30px;
    display: flex;
    align-items: center;
  }
`;

export default function Header() {
  return (
    <header css={headerContainerStyles}>
      <button onClick={() => Router.back()}>
        {/* <Image /> */}
        back
      </button>{' '}
      <Link href="/">FoodShare</Link>
    </header>
  );
}
