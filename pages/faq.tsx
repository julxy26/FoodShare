import { css } from '@emotion/react';
import Head from 'next/head';
import { SlideInFromRight } from '../components/Animations/SlideInFromRight';

export default function QuestionsAndAnswers() {
  return (
    <SlideInFromRight>
      <Head>
        <title>Q&A</title>
        <meta name="description" content="How FoodShare works" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Q&A</h1>
    </SlideInFromRight>
  );
}
