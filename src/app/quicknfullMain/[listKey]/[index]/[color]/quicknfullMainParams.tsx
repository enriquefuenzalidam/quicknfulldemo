"use client";
import React from "react";
import { useParams } from "next/navigation";
import ProntoVistaMainGal from "@/components/quicknfull/quicknfullMain";
import { ExampleImagesLists } from "@/components/quicknfull/exampleImagesLists";

const QuicknfullMainParams = () => {

  const params = useParams();

  const rawListKey = params.listKey;
  const listKey = Array.isArray(rawListKey) ? rawListKey[0] : rawListKey || "A1";

  const indexStr = Array.isArray(params.index) ? params.index[0] : params.index || "0";
  const indiceInicial = parseInt(indexStr, 10);

  const colorStr = Array.isArray(params.color) ? params.color[0] : params.color || "white";
  const seleccColor = decodeURIComponent(colorStr);

  return React.createElement('main', {
    style: { display: 'block', background: 'black', position: 'absolute', inset: 0, zIndex: 70, overflow: 'hidden', boxSizing: 'border-box'  } },
        React.createElement(ProntoVistaMainGal, { imagesList: ExampleImagesLists, listKey, indiceInicial, seleccColor } ) ) }


export default QuicknfullMainParams;
