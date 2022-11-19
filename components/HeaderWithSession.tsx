import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const headerContainerStyles = css`
  background-color: #fff;
  border-bottom: 1px solid black;
  border-bottom: 1px solid #939393;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 90px;
  gap: 50px;
  z-index: 1;

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

  span {
    margin-top: 6px;
  }
`;

export default function HeaderWithSession() {
  return (
    <header css={headerContainerStyles}>
      <div>
        <Link href="/">
          <a>
            <Image
              src="/back.png"
              width="35px"
              height="35px"
              alt="Arrow icon to go to the previous page."
            />
          </a>
        </Link>
      </div>

      <Link href="/">
        <p>FoodShare</p>
      </Link>

      <span>
        <Link href="/">
          <a>
            <Image
              src="/menu.png"
              width="25px"
              height="23px"
              alt="Navigation menu icon for more options."
            />
          </a>
        </Link>
      </span>
    </header>
  );
}
