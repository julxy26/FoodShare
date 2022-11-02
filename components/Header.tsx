import Link from 'next/link';
import Router from 'next/router';

export default function Header() {
  return (
    <header>
      <button onClick={() => Router.back()}>
        {/* <Image /> */}
        back
      </button>{' '}
      <Link href="/">FoodShare</Link>
    </header>
  );
}
