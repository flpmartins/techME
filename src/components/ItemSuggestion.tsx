import { ComponentProps } from 'react'
type IItemSuggestionProps =   ComponentProps<'button'> & {
  title: string
  className?: string
}
export function ItemSuggestion({ className, title, ...props}:IItemSuggestionProps) {
  

  return (
    <button className={className} {...props}>{title}</button>
  )
}