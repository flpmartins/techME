export function getHistoric():string[] {
  const historyc =localStorage.getItem('historics')

  if(historyc) {
    return JSON.parse(historyc)
  }
return []
}

export function setHistoric(item:string) {
  const historyc = localStorage.getItem('historics')

  if(historyc) {
    const parse = JSON.parse(historyc)
    localStorage.setItem('historics', JSON.stringify([...parse, item]))
  }

  localStorage.setItem('historics', JSON.stringify(item))
}