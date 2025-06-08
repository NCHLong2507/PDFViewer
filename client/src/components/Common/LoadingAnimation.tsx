interface LoadingAnimationProps {
  className: string;
  position: string;
}

export default function LoadingAnimation({ className, position }: LoadingAnimationProps ) {
  return (
    <div className={`${position} left-1/2 transform -translate-x-1/2`}>
      <div
        className={`${className} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
}
