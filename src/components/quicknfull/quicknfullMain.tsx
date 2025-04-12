import React, {useRef, useState, useEffect, useCallback, useMemo} from "react";
import NextImage, { StaticImageData } from "next/image";
import { isValidColor, useImagenesPreload } from './quicknfullComm';

interface ImageSizes {
    lgSize: string | StaticImageData;
    mdSize: string | StaticImageData;
    smSize: string | StaticImageData; };

interface ProntoVistaFullProps {
    imagesList: { [key: string]: ImageSizes[] };
    listKey?: string;
    jsonLista?: boolean;
    indiceInicial: number;
    seleccColor?: string; }

const QuicknfullMain: React.FC<ProntoVistaFullProps> = ({ imagesList, listKey, jsonLista = false, indiceInicial, seleccColor }) => {

    const listKeys = Object.keys(imagesList);
    const selectedKey = listKey && imagesList[listKey] ? listKey : listKeys[0];
    const currentList = imagesList[selectedKey] || [];
    const thumbnailsLista = currentList.map(item => item.smSize);
    const imagenesLista = currentList.map(item => item.lgSize);

    const [currentIndex, setCurrentIndex] = useState<number>(indiceInicial || 0);
    const [previousIndex, setPreviousIndex] = useState<number | null>(null);
    const [seleccionColor, setSeleccionColor] = useState<string>("white");
    const [screenReady, setScreenReady] = useState(false);
    const [xlScreen, setXlScreen] = useState(false);
    const [lgScreen, setLgScreen] = useState(false);
    const [mdScreen, setMdScreen] = useState(false);
    const [smScreen, setSmScreen] = useState(false);
    const [tnScreen, setTnScreen] = useState(false);
    const [mostrarOcultarLista, setMostrarOcultarLista] = useState(true);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const container = containerRef.current;
    const mainRef = useRef<HTMLDivElement | null>(null);
    const mainRefCurrent = mainRef?.current;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => setSeleccionColor(seleccColor ? isValidColor(seleccColor) ? seleccColor : isValidColor("#" + seleccColor) ? "#" + seleccColor : "rgba(0,0,0,1)" : "rgba(0,0,0,1)"), [seleccColor])

    const [loadedThumbnails, setLoadedThumbnails] = useState<boolean[]>(new Array(thumbnailsLista.length).fill(false));
    const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(imagenesLista.length).fill(false));

    const handleImageLoad = (index: number) => {
        setLoadedImages((prev) => {
            if (prev[index]) return prev;
            const updated = [...prev];
            updated[index] = true;
            return updated; } ) };

    const handleThumbnailLoad = (index: number) => {
        setLoadedThumbnails((prev) => {
            if (prev[index]) return prev;
            const updated = [...prev];
            updated[index] = true;
            return updated; } ) };

    useImagenesPreload(imagenesLista, currentIndex, "main image");
    useImagenesPreload(thumbnailsLista, currentIndex, "thumbnail");

    const thumbnailSize = useMemo(() => {
        return tnScreen ? 6 : smScreen ? 7 : mdScreen ? 8 : lgScreen ? 9 : xlScreen ? 10 : 10;
    }, [tnScreen, smScreen, mdScreen, lgScreen, xlScreen]);

    const loadingImage = useCallback(({ color = seleccionColor, alto = 24, fondo = 'transparent', imageIndex = 1 }) => {
        return React.createElement('div', { style: { color: color, position: 'absolute', boxSizing: 'border-box', inset: '0', display: 'flex', alignContent: 'center', justifyContent: 'center', background: fondo, opacity: imageIndex, transition: 'opacity 500ms ease-in-out' } },
            React.createElement('svg', { style: {  position: 'relative', width: alto+'%', height: 'auto', opacity: 0.38 }, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 640 512", fill: 'currentColor' },
                React.createElement('path', { fill: 'currentColor', d: 'M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z' } ) ) )
    }, [seleccionColor]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null; } } }, []);

    const resetCountdown = useCallback(() => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null; }

        setMostrarOcultarLista(true);

        timeoutRef.current = setTimeout(() => {
            setMostrarOcultarLista(false);
            timeoutRef.current = null; }, 2500); }, []);

    const smoothScroll = useCallback( (element: HTMLElement, targetIndex: number, duration: number) => {

        if (typeof window === "undefined") return;

        const startScroll = element.scrollLeft;
        const startTime = performance.now();

        const paddingSize = 1;
        const resultingThumbnailSize =  thumbnailSize - ( paddingSize * 2 );

        const thumbnailSizePx = 16 * resultingThumbnailSize;
        const marginSizePx = 0.15 * 16;

        const thumbnailAndMarginsSize = ( marginSizePx * 2 ) + thumbnailSizePx;
        
        const targetScroll = thumbnailAndMarginsSize * targetIndex;

        const animateScroll = (currentTime: number) => {

            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easeInOut = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            element.scrollLeft = startScroll + (targetScroll - startScroll) * easeInOut;

            if (elapsedTime < duration) requestAnimationFrame(animateScroll); };

        requestAnimationFrame(animateScroll); }, [thumbnailSize ]);

    useEffect(() => {

        if (typeof window === "undefined") return;
        if (!container) return;
    
        const targetElement = container?.children[currentIndex] as HTMLElement;
        if (!targetElement) return;
    
        smoothScroll(container, currentIndex, 600);

        return () => { if(container) container.scrollLeft = container.scrollLeft; };

    }, [ container, currentIndex, smoothScroll]); 

    useEffect(() => {

        const handleResize = () => {

            if (!mainRefCurrent) return;
            const width = mainRefCurrent.offsetWidth;

            setXlScreen(width >= 1280);
            setLgScreen(width >= 1024 && width < 1280);
            setMdScreen(width >= 768 && width < 1024);
            setSmScreen(width >= 640 && width < 768);
            setTnScreen(width < 640); };

        handleResize();
        window.addEventListener("resize", handleResize);
        setScreenReady(true);
        return () => window.removeEventListener("resize", handleResize);

    }, [mainRefCurrent]);

    const handleThumbnailClick = (index: number) => {
        if (index === currentIndex) return;
        setPreviousIndex(currentIndex);
        setCurrentIndex(index);
        resetCountdown() };

    useEffect(() => {
        if (!previousIndex) return;
        const timeout = setTimeout(() => {
          setPreviousIndex(null);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [previousIndex]);

    const [pageLoaded, setPageLoaded] = useState(false);
    useEffect(() => {
      if (!screenReady) return;
      const timeout = setTimeout(() => setPageLoaded(true), 100);
      return () => clearTimeout(timeout); }, [screenReady]);

    if (!screenReady) return null;

    return React.createElement('div', {ref: mainRef, style: { position: 'relative', boxSizing: 'border-box', width: '100%', height: '100%' } },

                React.createElement('section', { onMouseMove: !mostrarOcultarLista ? resetCountdown : null, role: "region", "aria-label": "Full-size Image", style: { display: 'block', boxSizing: 'border-box', position: 'absolute', inset: '0', cursor: 'default', transition: 'opacity 400ms ease-in-out', opacity: pageLoaded ? 1 : 0, pointerEvents: pageLoaded ? 'auto' : 'none', background: 'black' }},
                    loadingImage({ alto: 6, color: 'rgba(255,255,255,0.38)', imageIndex: loadedImages[currentIndex] ? 0 : 1 } ),
                    imagenesLista?.map((item, index) => (currentIndex === index || previousIndex === index) && (React.createElement('div', { key: index, style: { display: 'block', boxSizing: 'border-box', position: 'absolute', inset: '0', background: 'black', pointerEvents: currentIndex === index ? 'auto' : 'none', zIndex: previousIndex === index ? 2 : 1, opacity: currentIndex === index && loadedImages[index] ? 1 : 0, transition: 'opacity 500ms ease-in-out' } },
                        React.createElement(NextImage, { key: index, onLoad: () => handleImageLoad(index), src: item, alt: 'Gallery Image ' + index, fill: true, unoptimized: jsonLista ? true : false, style: { objectFit: 'contain' } } )
                        ) ) ) ),

                React.createElement('section', { role: "region", "aria-label": "Image Thumbnails", style: { display: 'block', boxSizing: 'border-box', opacity: mostrarOcultarLista ? 1 : 0, position: 'absolute', bottom: '0', left: '0', width: '100%', height: tnScreen ? '6rem' : smScreen ? '7rem' : mdScreen ? '8rem' : lgScreen ? '9rem' : xlScreen ? '10rem' : '10rem', overflow: 'hidden', maskImage: 'linear-gradient( to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 13%, rgba(0,0,0,1) 87%, rgba(0,0,0,0) 100%)', transition: 'all 600ms ease-in-out', pointerEvents: mostrarOcultarLista ? 'auto' : 'none', zIndex: 3 } },
                    React.createElement('div', { ref: containerRef, onScroll: resetCountdown, style: { display: 'block', boxSizing: 'border-box', position: 'relative', width: 'auto', height: '100%', padding: '1rem 0', whiteSpace: 'nowrap', overflowX: 'scroll', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' } },
                        thumbnailsLista?.map((item, index) => React.createElement('div', { key: index, role: "listitem", "aria-label": `Thumbnail ${index + 1}`, onClick: () => currentIndex !== index ? handleThumbnailClick(index) : null, style: { display: 'inline-block', boxSizing: 'border-box', position: 'relative', borderWidth: currentIndex !== index ? '0' : tnScreen ? '0.2rem' : mdScreen ? '0.25rem' : lgScreen ? '0.3rem' : xlScreen ? '0.4rem' :'0.4rem', borderStyle: 'solid', borderColor: seleccionColor, height: '100%', background: 'black', aspectRatio: '1 / 1', boxShadow: currentIndex !== index ? '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.8)' : '0 10px 12px -3px rgba(0, 0, 0, 0.6), 0 4px 3px -2px rgba(0, 0, 0, 1)', zIndex: currentIndex === index ? '65' : '62', transform: currentIndex === index ? 'scale(1.16)' : '', overflow: 'hidden', margin: index === 0 ? ` 0 0.15rem 0 calc(50% - ${ tnScreen ? '2rem' : smScreen ? '2.5rem' : mdScreen ? '3rem' : lgScreen ? '3.5rem' : xlScreen ? '4rem' : '4rem' } )` : index === thumbnailsLista.length-1 ? ` 0 calc(50% - ${ tnScreen ? '2rem' : smScreen ? '2.5rem' : mdScreen ? '3rem' : lgScreen ? '3.5rem' : xlScreen ? '4rem' : '4rem' } ) 0 0.15rem` : `0 0.15rem`, cursor: currentIndex !== index ? 'pointer' : 'default', borderRadius: '0.25rem', transition: 'transform 300ms ease-in-out, border 300ms ease-in-out'  } },
                            loadingImage({ alto: 24, fondo: 'linear-gradient(0deg, rgba(187,187,187,1) 0%, rgba(245,245,245,1) 100%)', imageIndex: loadedThumbnails[index] ? 0 : 1 }),
                            React.createElement(NextImage, { key: index, onLoad: () => handleThumbnailLoad(index), src: item, alt: 'Thumbnail Image ' + index, sizes: '10vw ', fill: true, unoptimized: jsonLista ? true : false, style: { objectFit: 'cover', opacity: loadedThumbnails[index] ? currentIndex === index ? '1' : '0.6' : '0', transition: 'opacity 300ms ease-in-out' } } ),
                            ) ) ) )

    ) };

export default QuicknfullMain;
