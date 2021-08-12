import React, { useEffect, useState, useRef } from "react";

export default function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      let id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }, [delay]);
}  

export function useEffectAllDepsChange(fn, deps) {
  const [changeTarget, setChangeTarget] = useState(deps);

  useEffect(() => {
    setChangeTarget(prev => {
      if (prev.every((dep, i) => dep !== deps[i])) {
        return deps;
      }

      return prev;
    });
  }, [deps]);

  useEffect(fn, changeTarget);
}


export const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
  }, deps);
}
