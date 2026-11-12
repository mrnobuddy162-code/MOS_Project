import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function MathFormula({ math, display = false, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && math) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          output: 'html'
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        containerRef.current.innerText = math;
      }
    }
  }, [math, display]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${display ? 'my-2 overflow-x-auto max-w-full text-center' : ''} ${className}`}
    />
  );
}
