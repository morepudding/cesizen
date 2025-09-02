"use client";
import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
});

interface LottieWrapperProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieWrapper({ animationData, className = "", loop = true, autoplay = true }: LottieWrapperProps) {
  return (
    <ClientOnly fallback={<div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>}>
      <Lottie 
        animationData={animationData}
        className={className}
        loop={loop}
        autoPlay={autoplay}
      />
    </ClientOnly>
  );
}
