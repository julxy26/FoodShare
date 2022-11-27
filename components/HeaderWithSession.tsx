import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const headerContainerStyles = css`
  background-color: #fff;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100vw;
  height: 90px;
  gap: 14.5%;
  padding-right: 30px;
  z-index: 2;
  top: -1px;

  a {
    color: #ffffff;
  }

  h1 {
    margin: -10px auto;
    padding-bottom: 50px;
    width: 300px;
    line-height: 50px;
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
    position: absolute;
    left: 27.23%;
    right: 27.23%;
    bottom: 26.67%;
    z-index: 2;
  }

  div {
    margin-top: 6px;
    background: #fff;
    background-image: url('/menu-background.jpg');
    background-repeat: no-repeat;
    background-position: 18% 70%;
    background-size: 373px 490px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container {
    margin: -50px;
    width: 100%;
  }

  .nav-container {
    background: none;
    display: flex;
    height: 62px;
    margin-right: -30px;
  }

  .navbar .nav-container li {
    list-style: none;
    width: 220px;
    height: 40px;
    background: #588777;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 40px;
  }

  .nav-container {
    display: block;
    position: relative;
    height: 60px;
  }

  .nav-container .checkbox {
    position: absolute;
    display: block;
    height: 32px;
    width: 32px;
    top: 20px;
    right: -50px;
    z-index: 5;
    opacity: 0;
    cursor: pointer;
  }

  .nav-container .profile {
    position: absolute;
    display: block;
    width: 30px;
    height: 30px;
    top: 260px;
    right: 45%;
    z-index: 5;
    cursor: pointer;
  }

  .nav-container .hamburger-lines {
    display: block;
    height: 17px;
    width: 25px;
    position: absolute;
    top: 25px;
    right: -50px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: none;
  }

  .nav-container .hamburger-lines .line {
    display: block;
    height: 2px;
    width: 100%;
    border-radius: 10px;
    background: #3d3535;
  }

  .nav-container .hamburger-lines .line1 {
    transform-origin: 10% 0%;
    transition: transform 0.4s ease-in-out;
  }

  .nav-container .hamburger-lines .line2 {
    transition: transform 0.2s ease-in-out;
  }

  .nav-container .hamburger-lines .line3 {
    transform-origin: 4% 95%;
    transition: transform 0.4s ease-in-out;
  }

  .navbar .menu-items {
    padding-top: 120px;
    height: 100vh;
    width: 100vw;
    transform: translate(100%);
    display: flex;
    flex-direction: column;
    margin-left: -250px;
    transition: transform 0.5s ease-in-out;
    text-align: center;
  }

  .navbar .menu-items li {
    margin: 5px auto;
    margin-bottom: 35px;
    font-weight: 600;
    font-size: 20px;
    line-height: 33px;
    text-align: center;
  }

  .nav-container input[type='checkbox']:checked ~ .menu-items {
    transform: translateX(0);
    transition: 0.5s all ease-in-out;
  }

  .nav-container input[type='checkbox']:checked ~ .hamburger-lines .line1 {
    transform: rotate(45deg);
  }

  .nav-container input[type='checkbox']:checked ~ .hamburger-lines .line2 {
    transform: scaleY(0);
  }

  .nav-container input[type='checkbox']:checked ~ .hamburger-lines .line3 {
    transform: rotate(-45deg);
  }

  @media (max-width: 360px) {
    gap: 10.5%;
  }

  @media (min-width: 400px) {
    gap: 17%;
  }

  @media (min-width: 540px) {
    gap: 24.6%;
  }

  @media (min-width: 700px) {
    gap: 33%;
  }

  @media (min-width: 1200px) {
    gap: 39%;
  }
`;
const arrowContainer = css`
  position: absolute;
  left: 20px;
  top: 28px;
  bottom: 27px;

  button {
    position: absolute;
    width: 30px;
    height: 30px;
    z-index: 8;
    opacity: 0;
  }
`;

export default function HeaderWithSession() {
  const router = useRouter();

  return (
    <header css={headerContainerStyles}>
      <span css={arrowContainer}>
        <button onClick={() => router.back()} />
        <Image
          src="/back.png"
          width="35px"
          height="35px"
          alt="Arrow icon to go to the previous page."
        />
      </span>

      <Link href="/">
        <p>FoodShare</p>
      </Link>

      <div className="navbar">
        <div className="container nav-container">
          <input className="checkbox" type="checkbox" />
          <div className="hamburger-lines">
            <span className="line line1" />
            <span className="line line2" />
            <span className="line line3" />
          </div>

          <div className="menu-items">
            <h1>
              Hello, <br /> nice to see you!
            </h1>
            <li>
              <Link href="/profile">My Profile</Link>
            </li>
            <li>
              <Link href="/profile/my-posts">My Posts</Link>
            </li>
            <li>
              <Link href="/faq">Q&A</Link>
            </li>
          </div>
        </div>
      </div>
    </header>
  );
}
