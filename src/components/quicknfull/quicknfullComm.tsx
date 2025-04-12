import { StaticImageData } from "next/image";
import { useEffect } from "react";



export const isValidColor = (color: string) => {
    if (typeof window === "undefined") return false;
    const s = new Option().style;
    s.color = color;
    return s.color !== ""; };

export const toHexColor = (color: string): string => {
    if (typeof window === "undefined") return "000000";
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return "000000"; 
    ctx.fillStyle = color;
    const computed = ctx.fillStyle;
    return computed.replace(/^#/, ""); };

export const useImagenesPreload = (
    imageList: (string | StaticImageData)[] = [],
    focusIndex: number,
    name: string = "image" ) => {
        useEffect(() => {

            if (!imageList || imageList.length === 0) return;

            const preloadQueue = [...imageList.keys()].sort((a, b) => {
                if (a === focusIndex) return -1;
                if (b === focusIndex) return 1;
                return 0; } );

            preloadQueue.forEach((index) => {
                const src = imageList[index];
                const img = new Image();
                try {
                    if (typeof src === "string") img.src = src;
                    else if (typeof src === "object" && "src" in src) img.src = src.src; }
                catch (error) { console.warn(`Preloading failed for ${name} at index ${index}:`, error); } } )

            }, [imageList, focusIndex, name]) };
