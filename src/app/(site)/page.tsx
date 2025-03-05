'use client'
import { Footer } from "@/components/Footer/Footer";
import { LGPDCookie } from "@/components/LGPDCookie/LGPDCookie";
import { BordedPanel } from "./components/BordedPanel/BordedPanel";
import { GraphicValuesType, SemiDonutCirle } from "./components/SemiDonutCirle/SemiDonutCirle";
import { useRef } from "react";
import gsap from 'gsap'
// import { Speedometer } from './components/speedo'

export default function Home() {

  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);

  const valuesArray: GraphicValuesType[] = [
    { value: 34, label: 'Label 1', color: '#FF6384' },
    { value: 5, label: 'Label 2', color: '#36A2EB' },
    { value: 12, label: 'Label 3', color: '#FFCE56' },
    { value: 49, label: 'Label 4', color: '#4BC0C0' },
  ]


  const handleClick = () => {
    // Animação da primeira div para a esquerda
    gsap.to(div1Ref.current, {
      x: '-100%',
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        // Mostrar a segunda div e iniciar sua animação
        gsap.to(div2Ref.current, {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            // Iniciar a timeline da segunda div
            const tl2 = gsap.timeline();
            tl2.to(div2Ref.current.querySelector('.componente'), {
              opacity: 1,
              y: 0,
              duration: 0.5,
            });

            // Mostrar a terceira div e iniciar sua animação
            gsap.to(div3Ref.current, {
              opacity: 1,
              duration: 0.5,
              onComplete: () => {
                // Iniciar a timeline da terceira div
                const tl3 = gsap.timeline();
                tl3.to(div3Ref.current.querySelector('.componente'), {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                });
              },
            });
          },
        });
      },
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <LGPDCookie />
        {/* <GraphicComponent /> */}
        {/* <Speedometer percentages={percentages} colors={colors} /> */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <BordedPanel ref={div1Ref}>
            <p>sss</p>
            <span>dfdfdf</span>
          </BordedPanel>
          <BordedPanel ref={div2Ref}>
            <p>teste</p>
            <span>teste2</span>
          </BordedPanel>
          <BordedPanel ref={div3Ref}>
            <p>teste</p>
            <SemiDonutCirle
              values={valuesArray}
              initialText="100%"
              graphWidth={600}
              graphHeight={300}
            />
            <button
              onClick={handleClick}
              style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}
            >
              Iniciar Animação
            </button>
          </BordedPanel>
        </div>
      </main>
      <Footer />
    </div>
  );
}
