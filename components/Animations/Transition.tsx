import { motion } from 'framer-motion';

export const Transition = (props: any) => {
  const variants = {
    out: {
      opacity: 0,
      y: 100,
      transition: {
        duration: 0,
      },
    },

    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0,
      },
    },
  };

  return (
    <motion.div variants={variants} animate="in" initial="out" exit="out">
      {props.children}
    </motion.div>
  );
};
