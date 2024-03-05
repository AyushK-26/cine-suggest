import { useRef, useEffect } from "react";

const UseDidMountEffect = (func, deps = []) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default UseDidMountEffect;
