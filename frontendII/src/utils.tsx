export const getPosition = (event: React.MouseEvent<HTMLElement>): {x:number, y:number} => {
  const { clientX, clientY } = event; // Position relative to the viewport
  const { offsetLeft, offsetTop } = event.currentTarget; 
  return {x:clientX - offsetLeft, y:clientY-offsetTop}; 
}