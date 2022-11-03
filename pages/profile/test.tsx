import Head from 'next/head';
import UploadImage, { Props } from '../../components/UploadImage';

export default function SingleUserPost(props: Props) {
  return (
    <div>
      <Head>
        <title>Welcome to FoodShare</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <UploadImage setImageUrl={props.setImageUrl} />
      </div>
    </div>
  );
}
