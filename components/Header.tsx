import Router from 'next/router';

export default function Header() {
  return (
    <header>
      <button onClick={() => Router.back()}>
        {/* <Image /> */}
        back
      </button>{' '}
      <span>FoodShare</span>
    </header>
  );
}
