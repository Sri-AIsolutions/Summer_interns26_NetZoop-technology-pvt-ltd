import { HTMLAttributes } from 'react';

export default function PageContainer({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
