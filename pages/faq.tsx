import { css } from '@emotion/react';
import Head from 'next/head';
import { SlideInFromRight } from '../components/Animations/SlideInFromRight';

const mainContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding-bottom: 120px;

  h1,
  h2,
  p {
    text-align: center;
    width: 90%;
  }
`;

export default function QuestionsAndAnswers() {
  return (
    <SlideInFromRight>
      <Head>
        <title>Q&A</title>
        <meta name="description" content="How FoodShare works" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={mainContainer}>
        <h1>Q&A</h1>

        <h2>WHAT IS FOOD WASTE?</h2>
        <p>
          Food waste is the discarding of food that is still fit to be consumed.
          There is food lost or wasted along the chain from farm to table. And
          it’s not just the food itself that goes to waste: it’s all the
          resources that were used in its production - from water to land and
          labour. When food is wasted, it has a harmful effect on the
          environment.
        </p>

        <h2>HOW BIG IS THE FOOD WASTE PROBLEM?</h2>
        <p>
          Unfortunately, it’s huge! Each year, around one third of the food
          produced in the world for human consumption gets wasted. This equals
          to 2.5 billion tons of food wasted every year and is responsible for
          10% of the global greenhouse gas emissions. If food loss and waste
          were its own country it would be the third-largest source of
          greenhouse gas emission after China and the United States.
        </p>

        <h2>WHO IS WASTING ALL THAT FOOD?</h2>
        <p>
          Nobody likes to see food go to waste, but reality is that it's very
          common for businesses, as well as households, to waste food. Food
          waste is a complex issue with many actors and occurs across the world
          and the entire food supply chain. Find more information on who wastes
          the most amount food in the food supply chain and where in the world
          food waste is the greatest issue.
        </p>

        <h2>WHAT IS FoodShare?</h2>
        <p>
          Too Good To Go fights food waste primarily through our app, that
          connects users with stores and restaurants that have unsold surplus
          food at the end of the day. Our greater mission, as an international
          company, is to inspire and empower everyone to take action against
          food waste.
        </p>
      </main>
    </SlideInFromRight>
  );
}
