import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <Link href="/">
        {/* <Image /> */}
        back
      </Link>{' '}
      <span>FoodShare</span>
    </header>
  );
}
