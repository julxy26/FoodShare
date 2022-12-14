import { motion } from 'framer-motion';

export const SlideInFromLeft = (props: any) => {
  const variants = {
    initialState: {
      x: -600,
      y: 0,
      opacity: 0,
    },
    animateState: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exitState: {
      opacity: 0,
    },
  };

  return (
    <div>
      <motion.div
        variants={variants}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          x: { type: 'spring', stiffness: 200, damping: 40 },
          opacity: { duration: 0.2 },
        }}
      >
        {props.children}
      </motion.div>
    </div>
  );
};
