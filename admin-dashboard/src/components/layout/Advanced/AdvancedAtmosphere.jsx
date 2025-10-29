import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useLayoutSettings } from '../../../hooks/useLayoutSettings.jsx';

const gradientPalettes = {
  'neo-aurora': [
    {
      id: 'aurora-1',
      size: 460,
      initial: { x: '-28%', y: '-18%' },
      animate: { x: ['-36%', '-12%', '-28%'], y: ['-20%', '-15%', '-22%'] },
      color: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.32), transparent 70%)',
      duration: 18,
    },
    {
      id: 'aurora-2',
      size: 520,
      initial: { x: '42%', y: '12%' },
      animate: { x: ['34%', '52%', '42%'], y: ['8%', '20%', '12%'] },
      color: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.25), transparent 68%)',
      duration: 22,
    },
    {
      id: 'aurora-3',
      size: 400,
      initial: { x: '4%', y: '68%' },
      animate: { x: ['-2%', '10%', '4%'], y: ['60%', '76%', '68%'] },
      color: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.22), transparent 70%)',
      duration: 20,
    },
  ],
  'cosmic-pulse': [
    {
      id: 'cosmic-1',
      size: 520,
      initial: { x: '-32%', y: '-14%' },
      animate: { x: ['-38%', '-10%', '-28%'], y: ['-16%', '-10%', '-18%'] },
      color: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.3), transparent 70%)',
      duration: 20,
    },
    {
      id: 'cosmic-2',
      size: 580,
      initial: { x: '46%', y: '8%' },
      animate: { x: ['38%', '56%', '46%'], y: ['2%', '18%', '8%'] },
      color: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.28), transparent 70%)',
      duration: 24,
    },
    {
      id: 'cosmic-3',
      size: 420,
      initial: { x: '-6%', y: '70%' },
      animate: { x: ['-14%', '4%', '-6%'], y: ['60%', '78%', '70%'] },
      color: 'radial-gradient(circle at center, rgba(244, 114, 182, 0.24), transparent 72%)',
      duration: 22,
    },
  ],
  'solar-flare': [
    {
      id: 'solar-1',
      size: 540,
      initial: { x: '-28%', y: '-16%' },
      animate: { x: ['-36%', '-8%', '-26%'], y: ['-18%', '-12%', '-20%'] },
      color: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.32), transparent 70%)',
      duration: 19,
    },
    {
      id: 'solar-2',
      size: 600,
      initial: { x: '40%', y: '12%' },
      animate: { x: ['32%', '50%', '40%'], y: ['6%', '22%', '12%'] },
      color: 'radial-gradient(circle at center, rgba(250, 204, 21, 0.26), transparent 70%)',
      duration: 23,
    },
    {
      id: 'solar-3',
      size: 440,
      initial: { x: '2%', y: '72%' },
      animate: { x: ['-8%', '12%', '2%'], y: ['64%', '80%', '72%'] },
      color: 'radial-gradient(circle at center, rgba(248, 113, 113, 0.22), transparent 72%)',
      duration: 21,
    },
  ],
  'midnight-mirage': [
    {
      id: 'mirage-1',
      size: 560,
      initial: { x: '-30%', y: '-18%' },
      animate: { x: ['-38%', '-6%', '-28%'], y: ['-20%', '-12%', '-22%'] },
      color: 'radial-gradient(circle at center, rgba(125, 211, 252, 0.3), transparent 72%)',
      duration: 21,
    },
    {
      id: 'mirage-2',
      size: 620,
      initial: { x: '44%', y: '10%' },
      animate: { x: ['34%', '54%', '44%'], y: ['4%', '20%', '10%'] },
      color: 'radial-gradient(circle at center, rgba(250, 204, 21, 0.24), transparent 70%)',
      duration: 24,
    },
    {
      id: 'mirage-3',
      size: 460,
      initial: { x: '-6%', y: '74%' },
      animate: { x: ['-14%', '8%', '-6%'], y: ['64%', '82%', '74%'] },
      color: 'radial-gradient(circle at center, rgba(134, 239, 172, 0.22), transparent 72%)',
      duration: 22,
    },
  ],
  'luminous-oasis': [
    {
      id: 'oasis-1',
      size: 520,
      initial: { x: '-28%', y: '-12%' },
      animate: { x: ['-34%', '-4%', '-24%'], y: ['-12%', '-6%', '-14%'] },
      color: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.24), transparent 68%)',
      duration: 20,
    },
    {
      id: 'oasis-2',
      size: 580,
      initial: { x: '42%', y: '14%' },
      animate: { x: ['32%', '50%', '42%'], y: ['10%', '24%', '14%'] },
      color: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.2), transparent 70%)',
      duration: 24,
    },
    {
      id: 'oasis-3',
      size: 440,
      initial: { x: '4%', y: '70%' },
      animate: { x: ['-6%', '12%', '4%'], y: ['62%', '80%', '70%'] },
      color: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2), transparent 72%)',
      duration: 21,
    },
  ],
  'luminous-mist': [
    {
      id: 'mist-1',
      size: 480,
      initial: { x: '-30%', y: '-16%' },
      animate: { x: ['-38%', '-8%', '-26%'], y: ['-18%', '-10%', '-20%'] },
      color: 'radial-gradient(circle at center, rgba(96, 165, 250, 0.26), transparent 68%)',
      duration: 20,
    },
    {
      id: 'mist-2',
      size: 560,
      initial: { x: '40%', y: '10%' },
      animate: { x: ['30%', '48%', '40%'], y: ['6%', '22%', '12%'] },
      color: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.22), transparent 70%)',
      duration: 23,
    },
    {
      id: 'mist-3',
      size: 420,
      initial: { x: '6%', y: '72%' },
      animate: { x: ['-4%', '14%', '6%'], y: ['64%', '82%', '72%'] },
      color: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.2), transparent 72%)',
      duration: 22,
    },
  ],
  'midnight-forge': [
    {
      id: 'forge-1',
      size: 540,
      initial: { x: '-26%', y: '-18%' },
      animate: { x: ['-34%', '-6%', '-24%'], y: ['-20%', '-14%', '-22%'] },
      color: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.3), transparent 72%)',
      duration: 21,
    },
    {
      id: 'forge-2',
      size: 600,
      initial: { x: '46%', y: '12%' },
      animate: { x: ['36%', '54%', '46%'], y: ['8%', '24%', '12%'] },
      color: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.26), transparent 70%)',
      duration: 24,
    },
    {
      id: 'forge-3',
      size: 460,
      initial: { x: '-4%', y: '74%' },
      animate: { x: ['-12%', '10%', '-4%'], y: ['62%', '82%', '74%'] },
      color: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.24), transparent 72%)',
      duration: 22,
    },
  ],
};

const parallaxLayers = [
  { id: 'layer-back', depth: -120, opacity: 0.28, blur: 40 },
  { id: 'layer-mid', depth: -60, opacity: 0.42, blur: 26 },
  { id: 'layer-front', depth: -25, opacity: 0.55, blur: 18 },
];

const layerBackground = {
  'layer-back': 'radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.06), transparent 65%)',
  'layer-mid': 'radial-gradient(circle at 70% 35%, rgba(255, 255, 255, 0.05), transparent 72%)',
  'layer-front': 'radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.09), transparent 68%)',
};

const ParallaxLayer = ({ layer, tilt, parallaxX, parallaxY }) => {
  const translateX = useTransform(parallaxX, (value) => value * (layer.depth / -60));
  const translateY = useTransform(parallaxY, (value) => value * (layer.depth / -60));
  const rotateY = useTransform(parallaxX, (value) => value * 0.6);

  return (
    <motion.div
      key={layer.id}
      style={{
        position: 'absolute',
        inset: '-10%',
        background: layerBackground[layer.id] ?? layerBackground['layer-back'],
        opacity: layer.opacity,
        filter: `blur(${layer.blur}px)`,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: tilt,
        rotateY,
        translateX,
        translateY,
        translateZ: layer.depth,
      }}
      transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.6 }}
    />
  );
};

const AdvancedAtmosphere = () => {
  const { settings } = useLayoutSettings();
  const gradients = useMemo(
    () => gradientPalettes[settings.themeVariant] ?? gradientPalettes['neo-aurora'],
    [settings.themeVariant],
  );

  const { scrollYProgress } = useScroll();
  const tilt = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        perspective: '1400px',
      }}
      onMouseMove={(event) => {
        const { innerWidth, innerHeight } = window;
        const offsetX = (event.clientX / innerWidth) * 2 - 1;
        const offsetY = (event.clientY / innerHeight) * 2 - 1;
        parallaxX.set(offsetX * 18);
        parallaxY.set(offsetY * 18);
      }}
    >
      {parallaxLayers.map((layer) => (
        <ParallaxLayer
          key={layer.id}
          layer={layer}
          tilt={tilt}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
        />
      ))}

      {gradients.map((item) => (
        <motion.div
          key={item.id}
          initial={item.initial}
          animate={item.animate}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: item.duration,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: item.size,
            height: item.size,
            borderRadius: '50%',
            backgroundImage: item.color,
            filter: 'blur(26px)',
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </Box>
  );
};

export default AdvancedAtmosphere;
