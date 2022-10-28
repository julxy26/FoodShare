import { css } from '@emotion/react';
import Link from 'next/link';

const containerStyles = css`
  margin-top: 20px;
  width: 100%;
  text-align: center;
  justify-content: center;
`;

export default function Footer() {
  return (
    <div css={containerStyles}>
      <footer>
        <div>
          <Link href="/">Home</Link> <Link href="/posts">Posts</Link>{' '}
          <Link href="/profile">Profile</Link>{' '}
        </div>

        {/* <div>copyright FoodShare 2023</div> */}
      </footer>
    </div>
  );
}
