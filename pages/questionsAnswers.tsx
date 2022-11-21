import Head from 'next/head';
import { Transition } from '../components/Animations/Transition';

export default function QuestionsAndAnswers() {
  return (
    <div>
            <Transition>

      <Head>
        <title>Q&A</title>
        <meta name="description" content="How FoodShare works" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Q&A</h1>
      </Transition>

    </div>
  );
}
