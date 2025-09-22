export const parentGradient =
  'linear(45deg, blue.400 0%, purple.500 50%, blue.600 100%)';
export const childGradient =
  'linear(45deg, blue.300 0%, cyan.400 50%, blue.500 100%)';
export const padding = 3;
export const borderRadius = 'xl';

// Text colors that work well with your gradients
export const textColors = {
  primary: 'white',
  secondary: 'gray.100',
  accent: 'blue.100',
  muted: 'gray.200',
  warning: 'yellow.100',
};

// Specific text color configurations for different components
export const componentTextStyles = {
  cardTitle: {
    color: textColors.primary,
    fontWeight: 'semibold',
  },
  cardValue: {
    color: textColors.primary,
    fontWeight: 'bold',
    fontSize: 'xl',
  },
  cardDescription: {
    color: textColors.secondary,
    fontSize: 'sm',
  },
  chartLabel: {
    color: textColors.secondary,
    fontSize: 'sm',
  },
};
