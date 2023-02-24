export function consoleLogFinalizer() {
  return (finalResult: any) => {
    console.log(finalResult);
  };
}
