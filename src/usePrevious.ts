import { useEffect, useRef } from "react";

/**
 * Previous state hook.
 * @param value
 */
const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

export default usePrevious;
