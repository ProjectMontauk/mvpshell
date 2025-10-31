declare module 'react-katex' {
  import { ReactNode } from 'react';

  export interface BlockMathProps {
    math?: string;
    children?: ReactNode;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    settings?: any;
  }

  export const BlockMath: React.FC<BlockMathProps>;
  export const InlineMath: React.FC<BlockMathProps>;
}

