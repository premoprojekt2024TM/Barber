import * as React from 'react';
import { Chip } from '@mui/material';
import { cn } from './utils';

// Define the available variants for the Badge
export type Variant = 'planned' | 'ongoing' | 'done' | 'outline' | 'archived';

// Create the badge styles for different variants
const badgeStyles = (variant: Variant) => {
  switch (variant) {
    case 'planned':
      return {
        color: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.1)', // light orange
        '&:hover': {
          backgroundColor: 'rgba(255, 165, 0, 0.2)', // darker orange on hover
        },
      };
    case 'ongoing':
      return {
        color: 'skyblue',
        backgroundColor: 'rgba(135, 206, 235, 0.1)', // light blue
        '&:hover': {
          backgroundColor: 'rgba(135, 206, 235, 0.2)', // darker blue on hover
        },
      };
    case 'done':
      return {
        color: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.1)', // light green
        '&:hover': {
          backgroundColor: 'rgba(0, 128, 0, 0.2)', // darker green on hover
        },
      };
    case 'outline':
      return {
        color: '#333',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      };
    case 'archived':
      return {
        color: 'gray',
        backgroundColor: 'rgba(169, 169, 169, 0.2)', // light gray
        '&:hover': {
          backgroundColor: 'rgba(169, 169, 169, 0.3)', // darker gray on hover
        },
      };
    default:
      return {};
  }
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  label: string; // The label to display inside the badge
}

function Badge({ className, variant = 'outline', label, ...props }: BadgeProps) {
  return (
    <Chip
      label={label}
      sx={{
        borderRadius: '9999px',
        fontSize: '0.75rem', // text size
        fontWeight: '600',
        padding: '0.25rem 0.75rem', // padding inside the chip
        transition: 'background-color 0.2s ease',
        ...badgeStyles(variant),
      }}
      className={cn(className)} // You can still use the cn utility to merge classes
      {...props}
    />
  );
}

export { Badge };
