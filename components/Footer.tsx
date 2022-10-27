import { css } from '@emotion/react';
import Link from 'next/link';

const footerStyles = css`
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 95%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
`;

export default function Footer() {
  return (
    <footer css={footerStyles}>
      <div>
        <Link href="/">Home</Link> <Link href="/posts">Posts</Link>{' '}
        <Link href="/profile">Profile</Link>{' '}
      </div>

      {/* <div>copyright FoodShare 2023</div> */}
    </footer>
  );
}
