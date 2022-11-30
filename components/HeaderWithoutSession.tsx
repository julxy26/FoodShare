import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const headerContainerStyles = css`
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;

  div {
    position: absolute;
    left: 20px;
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

  button {
    position: absolute;
    width: 30px;
    height: 30px;
    z-index: 8;
    opacity: 0;
  }
`;

export default function HeaderWithoutSession() {
  const router = useRouter();

  return (
    <header css={headerContainerStyles}>
      <div>
        <button onClick={() => router.back()} />
        <Image
          src="/back.png"
          width="35px"
          height="35px"
          alt="Arrow icon to go to the previous page."
        />
      </div>

      <Link href="/">
        <p>FoodShare</p>
      </Link>
    </header>
  );
}
