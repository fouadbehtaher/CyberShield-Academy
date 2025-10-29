import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { motion } from 'framer-motion';
import useAdvancedMode from '../../hooks/useAdvancedMode.js';

const MotionCardRoot = motion(Card);

const variantMap = {
  fade: {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  rise: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

const AnimatedCard = forwardRef(({ children, animation, delay, viewport, transition, ...cardProps }, ref) => {
  const isAdvanced = useAdvancedMode();

  if (!isAdvanced) {
    return (
      <Card ref={ref} {...cardProps}>
        {children}
      </Card>
    );
  }

  const motionVariants = variantMap[animation] ?? variantMap.fade;

  return (
    <MotionCardRoot
      ref={ref}
      layout
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20% 0px -10%', ...(viewport ?? {}) }}
      variants={motionVariants}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay, ...(transition ?? {}) }}
      {...cardProps}
    >
      {children}
    </MotionCardRoot>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

AnimatedCard.propTypes = {
  children: PropTypes.node,
  animation: PropTypes.oneOf(['fade', 'rise', 'zoom']),
  delay: PropTypes.number,
  viewport: PropTypes.object,
  transition: PropTypes.object,
};

AnimatedCard.defaultProps = {
  children: null,
  animation: 'fade',
  delay: 0,
  viewport: undefined,
  transition: undefined,
};

export default AnimatedCard;
