"use client";
import QuicknfullPrev from "@/components/quicknfull/quicknfullPrev";
import { ExampleImagesLists } from '@/components/quicknfull/exampleImagesLists';

export default function Home() {
  return (
      <main style={{ display: 'block', boxSizing: 'border-box', width: '100%', margin: '1rem', padding: '0' }}>

        <QuicknfullPrev

          imagesList = {ExampleImagesLists} 
          listKey = "A1"             // Conjunto "A1" de la lista "ExampleImagesLists".

          jsonLista = {false}        // Futura opción para usar lista JSON en lugar de IMPORTS.
                                     // En desarrollo.

          initialIndex = {4}         // Posición de la imagen a mostrar al comienzo de la iteración.

          discosColor = "red"        // Color de los selectores del navegador.

          maxAltura = {32}           // (rem) Usar 32, 28, 20, 18. Cualquier otra 
                                     // cifra será acercada a las anteriores.

          initialWidth = {880}       // Ancho de la columna en donde se posiciona el componente.
                                     // Opcional pero recomendado.

          iteracionTiempo = {3400}   // Intervalo de tiempo de la iteración.

          navegador = {true}         // Mostrar o no mostrar el navegador de selectores.

          />

      </main>
  );
};
