declare module 'react-bubble-ui' {
  import { ReactNode } from 'react';

  interface BubbleUIOptions {
    size: number;
    minSize: number;
    gutter: number;
    provideProps: boolean;
    numCols: number;
    fringeWidth: number;
    yRadius: number;
    xRadius: number;
    cornerRadius: number;
    showGuides: boolean;
    compact: boolean;
    gravitation: number;
  }

  interface BubbleUIProps {
    options: BubbleUIOptions;
    className?: string;
    children: ReactNode;
  }

  const BubbleUI: React.FC<BubbleUIProps>;

  export default BubbleUI;
}
