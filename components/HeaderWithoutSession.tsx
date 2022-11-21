import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const headerContainerStyles = css`
  z-index: 1;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 90px;
  gap: 50px;

  div {
    margin-left: 20px;
    margin-top: 3px;
  }

  p {
    font-family: 'Yeseva One';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 35px;
    text-align: center;
    border: 1px solid #939393;
    border-radius: 78px;
    width: 179px;
    height: 37px;
  }
`;

export default function HeaderWithoutSession() {
  const router = useRouter();

  return (
    <header css={headerContainerStyles}>
      <div onClick={() => router.back()}>
        <Image
          src="/back.png"
          width="35px"
          height="35px"
          alt="Arrow icon to go back"
        />
      </div>

      <Link href="/">
        <p>FoodShare</p>
      </Link>
    </header>
  );
}
