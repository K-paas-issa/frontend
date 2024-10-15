import { RefObject, useEffect } from "react";

interface ObserverOptions {
  target: RefObject<HTMLElement>;
  root?: RefObject<HTMLElement> | null;
  rootMargin?: string;
  threshold?: number;
  onIntersect: IntersectionObserverCallback;
}

export const useObserver = ({
  target,
  root = null,
  rootMargin = "0px",
  threshold = 1.0,
  onIntersect,
}: ObserverOptions) => {
  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    if (target.current) {
      observer = new IntersectionObserver(onIntersect, {
        root: root ? root.current : null,
        rootMargin,
        threshold,
      });

      if (target.current) {
        observer.observe(target.current);
      }
    }

    return () => observer && observer.disconnect();
  }, [target, root, rootMargin, threshold, onIntersect]);
};
