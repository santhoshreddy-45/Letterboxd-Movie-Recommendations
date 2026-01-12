import { useEffect } from "react";

const useScrollLock = (isLocked: boolean) => {
    useEffect(() => {
        if (typeof document === "undefined") return;

        const body = document.body;
        const html = document.documentElement;
        let scrollPosition = 0;

        if (isLocked) {
            scrollPosition = window.pageYOffset;

            const scrollBarCompensation = window.innerWidth - html.clientWidth;

            body.style.overflow = "hidden";
            body.style.position = "fixed";
            body.style.top = `-${scrollPosition}px`;
            body.style.width = "100%";

            if (scrollBarCompensation > 0) {
                body.style.paddingRight = `${scrollBarCompensation}px`;
            }
        } else {
            const scrollY = body.style.top;

            body.style.overflow = "";
            body.style.position = "";
            body.style.top = "";
            body.style.width = "";
            body.style.paddingRight = "";

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
        }

        return () => {
            const scrollY = body.style.top;
            body.style.overflow = "";
            body.style.position = "";
            body.style.top = "";
            body.style.width = "";
            body.style.paddingRight = "";
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
        };
    }, [isLocked]);
};

export default useScrollLock;
