export const findInputError = (obj:any, path:string | undefined) => {
  return path?.split('.').reduce((acc, part) => acc?.[part], obj);
}
