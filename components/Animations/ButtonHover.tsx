import { motion } from 'framer-motion';

export const ButtonHover = (props: any) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    {props.children}
  </motion.div>
);
