import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const headerContainerStyles = css`
  background-color: #fff;
  border-bottom: 1px solid black;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100vw;
  height: 90px;
  gap: 50px;
  padding-right: 30px;
  z-index: 4;

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

  div {
    margin-top: 6px;
  }
`;

export default function HeaderWithoutArrow() {
  return (
    <header css={headerContainerStyles}>
      <Link href="/">
        <p>FoodShare</p>
      </Link>

      <div>
        <Link href="/">
          <a>
            <Image
              src="/menu.png"
              width="25px"
              height="23px"
              alt="Arrow icon to go back"
            />
          </a>
        </Link>
      </div>
    </header>
  );
}
