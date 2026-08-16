import { useState, useEffect } from 'react';

const useIntersection = (elementRef, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing to keep animation static
          observer.unobserve(currentElement);
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement && !isVisible) {
        observer.unobserve(currentElement);
      }
    };
  }, [elementRef, rootMargin, isVisible]);

  return isVisible;
};

export default useIntersection;
