import { motion } from 'framer-motion';

export const Transition = (props: any) => {
  const variants = {
    enter: {
      x: -1000,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 400, damping: 70 },
        opacity: { duration: 0.2 },
      }}
    >
      {props.children}
    </motion.div>
  );
};
