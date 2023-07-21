export const frameLoop = (
  callback: (now: number, deltaTime: number) => void
) => {
  let request: number;
  let then: number;
  const animate = (now: number) => {
    then || (then = now);
    const deltaTime = now - then;
    then = now;
    callback(now / 1000, deltaTime / 1000);
    request = requestAnimationFrame(animate);
  };
  request = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(request);
};
