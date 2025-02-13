import * as React from 'react';
import { Chip } from '@mui/material';
import { cn } from './utils';

export type Variant = 
  | 'planned'
  | 'ongoing'
  | 'done'
  | 'outline'
  | 'archived'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

const badgeStyles = (variant: Variant) => {
  switch (variant) {
    case 'planned':
      return {
        color: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 165, 0, 0.2)', 
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
    case 'monday':
      return {
        color: 'white',
        backgroundColor: '#ff7043', // Monday - Orange
        '&:hover': {
          backgroundColor: '#f4511e', // darker orange on hover
        },
      };
    case 'tuesday':
      return {
        color: 'white',
        backgroundColor: '#66bb6a', // Tuesday - Green
        '&:hover': {
          backgroundColor: '#388e3c', // darker green on hover
        },
      };
    case 'wednesday':
      return {
        color: 'white',
        backgroundColor: '#42a5f5', // Wednesday - Blue
        '&:hover': {
          backgroundColor: '#1e88e5', // darker blue on hover
        },
      };
    case 'thursday':
      return {
        color: 'white',
        backgroundColor: '#ab47bc', // Thursday - Purple
        '&:hover': {
          backgroundColor: '#8e24aa', // darker purple on hover
        },
      };
    case 'friday':
      return {
        color: 'white',
        backgroundColor: '#ffca28', // Friday - Yellow
        '&:hover': {
          backgroundColor: '#ffb300', // darker yellow on hover
        },
      };
    case 'saturday':
      return {
        color: 'white',
        backgroundColor: '#ff8a80', // Saturday - Light Red
        '&:hover': {
          backgroundColor: '#f44336', // darker red on hover
        },
      };
    case 'sunday':
      return {
        color: 'white',
        backgroundColor: '#7e57c2', // Sunday - Purple
        '&:hover': {
          backgroundColor: '#5e35b1', // darker purple on hover
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
        ...badgeStyles(variant), // Apply styles based on the variant
      }}
      className={cn(className)} // You can still use the cn utility to merge classes
      {...props}
    />
  );
}

export { Badge };
