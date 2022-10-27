import Link from 'next/link';

export default function Header() {
  return (
    <div>
      <Link href="/">
        {/* <Image /> */}
        Back
      </Link>
      <header>FoodShare</header>
    </div>
  );
}
