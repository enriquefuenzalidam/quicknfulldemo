// import Image from "next/image";
"use client";
import QuicknfullPrev from "@/components/quicknfull/quicknfullPrev";
import { ExampleImagesLists } from '@/components/quicknfull/exampleImagesLists';

export default function Home() {
  return (
      <main style={{ margin: '1rem', boxSizing: 'border-box' }}>
        <QuicknfullPrev
          imagesList = {ExampleImagesLists} 
          listKey = "A1" 
          jsonLista = {false} 
          initialIndex = {0} 
          discosColor = "red" 
          maxAltura = {32} 
          initialWidth = {880} 
          iteracionTiempo = {3400} 
          navegador = {true}
          />
      </main>
  );
};
