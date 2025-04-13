import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import NextImage, { StaticImageData } from 'next/image';
import { isValidColor, toHexColor, useImagenesPreload } from './quicknfullComm';

interface ImageSizes {
    lgSize: string | StaticImageData;
    mdSize: string | StaticImageData;
    smSize: string | StaticImageData; };

interface ProntoVistaPrevGalProps {
  imagesList: { [key: string]: ImageSizes[] };
  listKey?: string;
  jsonLista?: boolean;
  initialIndex?: number;
  discosColor?: string;
  maxAltura?: number;
  initialWidth?: number;
  iteracionTiempo?: number;
  navegador?: boolean; }

interface GalleryIndexes {
    newCurrent: number; prevCurrent: number;
    newBefore1: number; newBefore2: number;
    newAfter1: number; newAfter2: number;
    prevBefore1: number; prevBefore2: number;
    prevAfter1: number; prevAfter2: number;
    newSet: Set<number>; prevSet: Set<number>;
    commonElements: number[]; exclusiveNewElements: number[]; exclusivePrevElements: number[]; }

const QuicknfullPrev: React.FC<ProntoVistaPrevGalProps> = ({ imagesList, listKey, jsonLista = false, initialIndex = 0, discosColor = "#000", maxAltura = 32, initialWidth = 880, iteracionTiempo = 3400, navegador = true }) => {

    const listKeys = Object.keys(imagesList);
    const selectedKey = listKey && imagesList[listKey] ? listKey : listKeys[0];
    const currentList = imagesList[selectedKey] || [];
    const imagenesLista = currentList.map(item => item.mdSize);

    const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>( initialIndex === 0 ? imagenesLista.length - 1 : initialIndex - 1);

    useImagenesPreload(imagenesLista, currentGalleryIndex, "gallery image");

    const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(imagenesLista.length).fill(false));
    const handleImageLoad = (index: number) => {
        setLoadedImages((prev) => {
            if (prev[index]) return prev;
            const updated = [...prev];
            updated[index] = true;
            return updated; });
    };

    const seleccionColor = isValidColor(discosColor) ? discosColor : "#000";
    const hexSeleccColor = toHexColor(seleccionColor);

    const computeGalleryIndexes = (newIndex: number, prevIndex: number, total: number): GalleryIndexes => {

        const newCurrent = newIndex;
        const newBefore1 = (newIndex - 1 + total) % total;
        const newBefore2 = (newIndex - 2 + total) % total;
        const newAfter1 = (newIndex + 1) % total;
        const newAfter2 = (newIndex + 2) % total;

        const prevCurrent = prevIndex;
        const prevBefore1 = (prevIndex - 1 + total) % total;
        const prevBefore2 = (prevIndex - 2 + total) % total;
        const prevAfter1 = (prevIndex + 1) % total;
        const prevAfter2 = (prevIndex + 2) % total;

        const newSet = new Set([newCurrent, newBefore1, newBefore2, newAfter1, newAfter2]);
        const prevSet = new Set([prevCurrent, prevBefore1, prevBefore2, prevAfter1, prevAfter2]);

        const commonElements = [...newSet].filter(index => prevSet.has(index));
        const exclusiveNewElements = [...newSet].filter(index => !prevSet.has(index));
        const exclusivePrevElements = [...prevSet].filter(index => !newSet.has(index));

        return {
            newCurrent, newBefore1, newBefore2, newAfter1, newAfter2,
            prevCurrent, prevBefore1, prevBefore2, prevAfter1, prevAfter2,
            newSet, prevSet, commonElements, exclusiveNewElements, exclusivePrevElements } };

    const scndContainerCapaRef = useRef<(HTMLDivElement | null)>(null);
    const [scndContainerCapaWidth, setScndContainerCapaWidth] = useState<number>(initialWidth || 0);

    const tiempoIntervalo = iteracionTiempo;
    const [isMdParent, setIsMdParent] = useState<boolean>(scndContainerCapaWidth >= 640 && scndContainerCapaWidth < 768);
    const [isLgParent, setIsLgParent] = useState<boolean>(scndContainerCapaWidth >= 768 && scndContainerCapaWidth < 1024);
    const [isXlParent, setIsXlParent] = useState<boolean>(scndContainerCapaWidth >= 1024);
    const [screenReady, setScreenReady] = useState(false);

    const cajaAltura = maxAltura;
    const [galAlturaXl, setGalAlturaXl] = useState<number>(Math.min(32, Math.max(18, cajaAltura)));
    const [galAlturaLg, setGalAlturaLg] = useState<number>(Math.min(32, Math.max(18, galAlturaXl - 4)));
    const [galAlturaMd, setGalAlturaMd] = useState<number>(Math.min(32, Math.max(18, galAlturaLg - 8)));
    const [galAlturaSm, setGalAlturaSm] = useState<number>(Math.min(32, Math.max(18, galAlturaMd - 2)));

    useEffect(() => {
        const xl = Math.min(32, Math.max(18, cajaAltura));
        const lg = Math.min(32, Math.max(18, xl - 4));
        const md = Math.min(32, Math.max(18, lg - 8));
        const sm = Math.min(32, Math.max(18, md - 2));
        setGalAlturaXl(xl);
        setGalAlturaLg(lg);
        setGalAlturaMd(md);
        setGalAlturaSm(sm);
    }, [cajaAltura]);

    const scndContainerCapaRefCurrent = scndContainerCapaRef.current;
    useEffect(() => {
        const handleResize = () => {
            if(!scndContainerCapaRefCurrent?.offsetWidth) return;
            const capaRefWidth = scndContainerCapaRefCurrent.offsetWidth;
            setScndContainerCapaWidth(capaRefWidth);
            setIsMdParent(capaRefWidth >= 640 && capaRefWidth < 768);
            setIsLgParent(capaRefWidth >= 768 && capaRefWidth < 1024);
            setIsXlParent(capaRefWidth >= 1024);
        }
        handleResize();
        setScreenReady(true);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [ scndContainerCapaRefCurrent]);

    const [discosNavegador, setDiscosNavegador] = useState(true);
    useEffect(() => setDiscosNavegador(navegador), [navegador]);

    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imageRefsB = useRef<(HTMLAnchorElement | null)[]>([]);
    const innerSpanDiscRefs = useRef<(HTMLSpanElement)[]>([]);
    const outerSpanDiscRefs = useRef<(HTMLSpanElement)[]>([]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const firstIntervalDoneRef = useRef(false);

    const galleryIndexChange = useCallback(() => setCurrentGalleryIndex((prevIndex) => (prevIndex + 1) % imagenesLista.length), [imagenesLista.length]);
      
    const startInterval = useCallback(() => {
        if (!screenReady) return;
        if (!firstIntervalDoneRef.current) {
            setTimeout(() => {
                galleryIndexChange();
                firstIntervalDoneRef.current = true;
                intervalRef.current = setInterval(galleryIndexChange, tiempoIntervalo) }, 50)  }
        else intervalRef.current = setInterval(galleryIndexChange, tiempoIntervalo);
    }, [ firstIntervalDoneRef, tiempoIntervalo, screenReady, galleryIndexChange]);

    const clearIntervalTimer = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current); }, []);

    useEffect(() => {
        startInterval();
        return () => clearIntervalTimer(); }, [ startInterval, clearIntervalTimer]);

    const handleNavClick = useCallback((newIndex: number) => {
        clearIntervalTimer();
        setCurrentGalleryIndex(newIndex);
        startInterval(); }, [clearIntervalTimer, startInterval]);

    const loadingImage = useCallback(({ color = seleccionColor, alto = 24, imageIndex = 1 }) => {
        return React.createElement('div', { style: { color: color, position: 'absolute', inset: '0', display: 'flex', alignContent: 'center', justifyContent: 'center', background: 'transparent', opacity: imageIndex, transition: 'all 300ms ease-in-out', pointerEvents: 'none' } },
            React.createElement('svg', { style: { width: alto+'%', height: 'auto', opacity: 0.15 }, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 640 512", fill: 'currentColor' },
                React.createElement('path', { fill: 'currentColor', d: 'M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z' } ) ) )
    }, [seleccionColor])

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleHoverTrigger = useCallback((index: number) => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setHoveredIndex(index);
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredIndex(null);
        hoverTimeoutRef.current = null; }, tiempoIntervalo/2);
    }, [tiempoIntervalo]);

    useEffect(() => { return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current) } }, []);

    const maximizeSign = useCallback(({ colors = seleccionColor, alto = 24, ndx = 0  }) => {
        return React.createElement('div', { style: { color: colors, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', opacity: hoveredIndex === ndx ? 1 : 0, transition: 'opacity '+ tiempoIntervalo/8 +'ms ease-in-out', pointerEvents: 'none' } },
            React.createElement('svg', { style: { width: alto+'%', height: alto+'%', background: 'rgba(0,0,0,0.24)', borderRadius: '0.125rem' }, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: 'transparent' },
                React.createElement('path', { stroke: 'currentColor', strokeWidth: '0.62', strokeLinejoin: 'butt', strokeLinecap: 'butt', d: 'M21 9V3H15' } ),
                React.createElement('path', { stroke: 'currentColor', strokeWidth: '0.62', strokeLinejoin: 'butt', strokeLinecap: 'butt', d: 'M3 15V21H9' } ),
                React.createElement('path', { stroke: 'currentColor', strokeWidth: '0.62', strokeLinejoin: 'butt', strokeLinecap: 'butt', d: 'M21 3L13.5 10.5' } ),
                React.createElement('path', { stroke: 'currentColor', strokeWidth: '0.62', strokeLinejoin: 'butt', strokeLinecap: 'butt', d: 'M10.5 13.5L3 21' } ) ) )
    }, [seleccionColor, hoveredIndex, tiempoIntervalo])

    const previousGalleryIndexRef = useRef<number>(currentGalleryIndex);
    useEffect(() => {
        previousGalleryIndexRef.current = currentGalleryIndex; }, [currentGalleryIndex]);

    const visibleImages = useMemo(() => {

        const indexes = computeGalleryIndexes( currentGalleryIndex, previousGalleryIndexRef.current, imagenesLista.length );
        const { newBefore2, newBefore1, newCurrent, newAfter1, newAfter2, commonElements, exclusiveNewElements, exclusivePrevElements } = indexes;

        const newsBeforeAndAfter = new Set([newBefore2, newBefore1, newAfter1, newAfter2]);
        const beforeAfter1 = new Set([ newBefore1, newAfter1 ]);

        const onlyNewCurrent = new Set([ newCurrent ]);
        const onlyNewBefore2 = new Set([ newBefore2 ]);
        const onlyNewBefore1 = new Set([ newBefore1 ]);
        const onlyNewwAfter1 = new Set([ newAfter1 ]);

        const onlyPrvIndexes = new Set([ ...exclusivePrevElements ]);
        const previousAndCurrentIndexes = new Set([ ...commonElements, ...exclusiveNewElements, ...exclusivePrevElements ]);

        const currentAltura = isXlParent ? galAlturaXl - 5.4 : isLgParent ? galAlturaLg - 4.6 : isMdParent ? galAlturaMd - 3.6 : galAlturaSm - 3;

        return imagenesLista.map((item, index) => {

                const imageBlockStyleA: React.CSSProperties = ({
                    display: "block", pointerEvents: 'auto', cursor: 'pointer', boxSizing: 'border-box', position: "absolute", top: isXlParent ? "1.8rem" : isLgParent ? "1.4rem" : isMdParent ? "1.2rem" : "1rem", borderRadius: "0.125rem", transition: "all "+ tiempoIntervalo/4 + "ms linear", overflow: "hidden", background: 'linear-gradient(0deg, rgba(187,187,187,1) 0%, rgba(245,245,245,1) 100%)', 
                    opacity: previousAndCurrentIndexes.has(index) ? onlyPrvIndexes.has(index) ? 0.09 : 1 : 0,
                    zIndex: onlyPrvIndexes.has(index) ? 10 : previousAndCurrentIndexes.has(index) ? onlyNewCurrent.has(index) ? 50 : beforeAfter1.has(index) ? 40 : 30 : 10,
                    boxShadow: onlyPrvIndexes.has(index) ? "none" : previousAndCurrentIndexes.has(index) ? onlyNewCurrent.has(index) ? "0 10px 12px -3px rgba(0, 0, 0, 0.6), 0 4px 3px -2px rgba(0, 0, 0, 0.6)" : beforeAfter1.has(index) ? "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.4)" : "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.2)" : "none",
                    left: onlyPrvIndexes.has(index) ? `calc( 50% - ${currentAltura * 0.5}rem )` : previousAndCurrentIndexes.has(index) ? onlyNewCurrent.has(index) ? `calc( 50% - ${currentAltura * 0.5}rem )` : onlyNewBefore2.has(index) ? `0%` : onlyNewBefore1.has(index) ? `calc( 20% - ${currentAltura * 0.2}rem )` : onlyNewwAfter1.has(index) ? `calc( 80% - ${currentAltura * 0.8}rem )` : `calc( 100% - ${currentAltura}rem )` : `calc( 50% - ${currentAltura * 0.5}rem )`,
                    transform: onlyPrvIndexes.has(index) ? "scale(0.01)" : previousAndCurrentIndexes.has(index) ? onlyNewCurrent.has(index) ? "scale(1.1)" : beforeAfter1.has(index) ? "scale(1.05)" : "scale(0.92)" : "scale(0.01)",
                    height: currentAltura + 'rem', width: currentAltura + 'rem'
                })

                const imageBlockStyleB: React.CSSProperties = ({
                    position: 'relative', boxSizing: 'border-box', width: '100%', height: '100%', display: 'block', justifyContent: 'center', alignItems: 'center', transition: "all 300ms linear", margin: '0', padding: '0',
                    opacity: onlyNewCurrent.has(index) ? 1 : beforeAfter1.has(index) ? 0.62 : 0.24 })

                const imageElementStyle: React.CSSProperties = ({
                    objectFit: 'cover', transition: 'opacity 300ms ease-in-out', opacity: previousAndCurrentIndexes.has(index) ? loadedImages[index] ? 1 : 0 : 0 })

                const delayedHref = onlyNewCurrent.has(index) ? `/quicknfullMain/${listKey}/${currentGalleryIndex}/${encodeURIComponent(hexSeleccColor)}` : '#';

                const clickHandler = (e: React.MouseEvent<HTMLElement>, index: number) => {
                    if (newsBeforeAndAfter.has(index)) { e.preventDefault(); handleNavClick(index); }
                    else if (!onlyNewCurrent.has(index)) e.preventDefault() };
        
                return React.createElement("div", { key: index, ref: (el) => { imageRefs.current[index] = el as HTMLDivElement | null }, style: imageBlockStyleA, ...(currentGalleryIndex === index && { onMouseMove: () => handleHoverTrigger(index), onMouseLeave: () => setHoveredIndex(null) }) },
                            loadingImage( { alto: 15, imageIndex: !previousAndCurrentIndexes.has(index) || !loadedImages[index] ? 1 : 0 } ),
                            previousAndCurrentIndexes.has(index) && React.createElement('a', { href: delayedHref, onClick: (e) => clickHandler(e, index), ref: (el) => { imageRefsB.current[index] = el as HTMLAnchorElement | null }, style: imageBlockStyleB },
                                React.createElement(NextImage, { sizes: '(max-width: 1024px) 50vw, 512px', src: typeof item === "string" ? item : item.src, alt: 'Gallery Image ' + index, fill: true, unoptimized: jsonLista ? true : false, onLoad: () => handleImageLoad(index), style: imageElementStyle }),
                                currentGalleryIndex === index && maximizeSign({ colors: 'rgba(255,255,255,0.76)', alto: 24, ndx: index } ) ) ) } );

    }, [ handleHoverTrigger, handleNavClick, hexSeleccColor, listKey, jsonLista, currentGalleryIndex, previousGalleryIndexRef, imagenesLista, loadingImage, loadedImages, tiempoIntervalo, maximizeSign, isXlParent, isLgParent, isMdParent, galAlturaXl, galAlturaLg, galAlturaMd, galAlturaSm ]);  

    const visibleSelectores = useMemo(() => {

        const indexes = computeGalleryIndexes( currentGalleryIndex, previousGalleryIndexRef.current, imagenesLista.length );
        const { prevCurrent, newCurrent } = indexes;

        const runningWidth = isXlParent || isLgParent ? '4rem' : isMdParent ? '3rem' : '3rem';
        const stillWidth = isXlParent || isLgParent ? '1rem' : isMdParent ? '0.75rem' : '0.75rem';

        if(!discosNavegador) return;
        return imagenesLista.map((_, index) => {

            const outerSpanDisc = {
                position: 'relative', boxSizing: 'border-box', margin: isXlParent || isLgParent ? '0.5rem' : isMdParent ? '0.375rem' : '0.375rem', display: 'inline-block', borderRadius: isXlParent || isLgParent ? '0.3rem' : isMdParent ? '0.225rem' : '0.225rem', overflow: 'hidden', height: isXlParent || isLgParent ? '1rem' : isMdParent ? '0.75rem' : '0.75rem', transition: 'all ' + tiempoIntervalo/8 + 'ms linear', backgroundColor: 'rgba(0,0,0,0.08)',
                cursor:  newCurrent === index ? 'default' : ( prevCurrent !== newCurrent ) && prevCurrent === index ? 'pointer' : 'pointer',
                width: newCurrent === index ? runningWidth : ( prevCurrent !== newCurrent ) && prevCurrent === index ? stillWidth : stillWidth }
            const innerSpanDisc = {
                pointerEvents: 'none', display: 'inline-block', boxSizing: 'border-box', position: 'absolute', left: '0', top: '0', borderRadius: isXlParent || isLgParent ? '0.3rem' : isMdParent ? '0.225rem' : '0.225rem', height: '100%', backgroundColor: seleccionColor, transition: 'width '+tiempoIntervalo+'ms linear, opacity ' + tiempoIntervalo/8 + 'ms linear',
                opacity: newCurrent === index ? 1 : ( prevCurrent !== newCurrent ) && prevCurrent === index ? 0 : 0,
                width: newCurrent === index ? runningWidth : ( prevCurrent !== newCurrent ) && prevCurrent === index ? stillWidth : stillWidth }

            return React.createElement("span", { key: index, onClick: () => currentGalleryIndex === index ? null : handleNavClick(index), ref: (el) => { outerSpanDiscRefs.current[index] = el as HTMLSpanElement }, style: outerSpanDisc },
                        React.createElement("span", { ref: (el) => { innerSpanDiscRefs.current[index] = el as HTMLSpanElement }, style: innerSpanDisc } ) ) } )

    }, [handleNavClick, currentGalleryIndex, previousGalleryIndexRef, discosNavegador, imagenesLista, isXlParent, isLgParent, isMdParent, seleccionColor, tiempoIntervalo]);

    const mainContainerStyle: React.CSSProperties = useMemo(() => ({
        position: 'relative', boxSizing: 'border-box', display: 'block', minHeight: 'auto', opacity: firstIntervalDoneRef ? 1 : 0, transition: 'opacity ' + tiempoIntervalo/8 + 'ms ease-in-out' }),
        [ firstIntervalDoneRef, tiempoIntervalo]);
    const scndContainerStyle: React.CSSProperties = {
        position: 'relative', boxSizing: 'border-box', display: 'block', maxWidth: '64rem', width: '100%', height: 'auto', marginLeft: 'auto', marginRight: 'auto' }
    const hghtContainerStyle: React.CSSProperties = useMemo(() => ({
        boxSizing: 'border-box', display: 'block', transition: 'all 700ms linear', overflowY: 'visible', overflowX: 'hidden', width: '100%', position: 'relative', height: isXlParent ? `${galAlturaXl}rem` : isLgParent ? `${galAlturaLg}rem` : isMdParent ? `${galAlturaMd}rem` : `${galAlturaSm}rem` }),
        [isXlParent, isLgParent, isMdParent, galAlturaXl, galAlturaLg, galAlturaMd, galAlturaSm]);
    const outerImagenesLista: React.CSSProperties = {
        position: "relative", boxSizing: 'border-box', display: 'block', width: "100%", height: "100%", overflow: "hidden", transition: "width 700ms linear" }

    if (!screenReady) return null;

    return React.createElement( "div", { style: mainContainerStyle },

        React.createElement( "div", { ref: scndContainerCapaRef, style: scndContainerStyle },
            React.createElement( "div", { style: hghtContainerStyle },
                !!imagenesLista.length && React.createElement("div", { style: outerImagenesLista }, visibleImages ) ) ),

        !!discosNavegador && ( React.createElement( "div", { style: { maxWidth: '40rem', width: '100%', margin: '0 auto', textAlign: 'center', paddingTop: '1.25rem', position: 'relative', boxSizing: 'border-box', display: 'block' } },
                !!imagenesLista.length && React.createElement( "div", null, visibleSelectores ) ) ),

    ) };

export default QuicknfullPrev;
