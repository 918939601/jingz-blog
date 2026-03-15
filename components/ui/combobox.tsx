// * import from https://github.com/aifuxi/fuxiaochen/blob/master/components/ui/combobox.tsx
// * 感谢大佬🥹 https://github.com/aifuxi
'use client'

import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { ScrollArea } from './scroll-area'
import { cn } from '@/lib/utils'
import TagItemBadge from '../shared/tag-item-badge'
// 源代码来自：https://github.com/shadcn-ui/ui/issues/927#issuecomment-1788084995
// 根据自己需要做了部分修改

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxPropsSingle {
  options: ComboboxOption[]
  emptyText?: string
  clearable?: boolean
  selectPlaceholder?: string
  searchPlaceholder?: string
  multiple?: false
  value?: string
  onValueChange?: (value: string) => void
}

interface ComboboxPropsMultiple {
  options: ComboboxOption[]
  emptyText?: string
  clearable?: boolean
  selectPlaceholder?: string
  searchPlaceholder?: string
  multiple: true
  value?: string[]
  onValueChange?: (value: string[]) => void
}

export type ComboboxProps = ComboboxPropsSingle | ComboboxPropsMultiple

export const handleSingleSelect = (
  props: ComboboxPropsSingle,
  option: ComboboxOption,
) => {
  if (props.clearable) {
    props.onValueChange?.(option.value === props.value ? '' : option.value)
  } else {
    props.onValueChange?.(option.value)
  }
}

export const handleMultipleSelect = (
  props: ComboboxPropsMultiple,
  option: ComboboxOption,
) => {
  if (props.value?.includes(option.value)) {
    if (!props.clearable && props.value.length === 1) return false
    props.onValueChange?.(props.value.filter(value => value !== option.value))
  } else {
    props.onValueChange?.([...(props.value ?? []), option.value])
  }
}

export const Combobox = React.forwardRef(
  (props: ComboboxProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')

    const tagMap = React.useMemo(() => {
      return new Map<string, string>(
        props.options.map(el => [el.value, el.label]) ?? [],
      )
    }, [props.options])

    const filteredOptions = React.useMemo(() => {
      return props.options.filter(el =>
        el.label.toLowerCase().trim().includes(search.trim().toLowerCase()),
      )
    }, [props.options, search])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            variant="outline"
            aria-expanded={open}
            className="glass-field inline-flex h-auto min-h-12 w-full justify-between whitespace-normal px-4 py-3 text-left hover:bg-white dark:hover:bg-white/[0.08]"
          >
            <div
              className={cn(
                'flex w-full flex-row flex-wrap gap-x-2 gap-y-1 text-left font-normal text-muted-foreground',
                {
                  'line-clamp-1': !props.multiple,
                },
              )}
            >
              {/* 多选 */}
              {props.multiple &&
                props.value &&
                Boolean(props.value.length) &&
                props.value.map(el => (
                  <TagItemBadge tag={tagMap.get(el)!} key={el} />
                ))}

              {/* 单选 */}
              {!props.multiple &&
                props.value &&
                props.value !== '' &&
                props.options.find(option => option.value === props.value)
                  ?.label}

              {/* 空态 */}
              {(!props.value || props.value.length === 0) &&
                (props.selectPlaceholder ?? 'Select an option')}
            </div>
            <div className="flex h-full shrink-0 items-center">
              {/* 多选时，显示清除全部按钮 */}
              {props.multiple && Boolean(props.value?.length) && (
                <X
                  className={cn(
                    'ml-2 h-4 w-4 rounded-full text-foreground/45 opacity-70 transition hover:text-primary hover:opacity-100',
                  )}
                  onClick={e => {
                    props.onValueChange?.([])

                    // 阻止冒泡，防止触发外层按钮的点击事件
                    e.stopPropagation()
                  }}
                />
              )}
              <ChevronDown
                className={cn(
                  'ml-2 h-4 w-4 shrink-0 rotate-0 text-foreground/45 transition-transform',
                  open && 'rotate-180',
                )}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-2"
        >
          <Command shouldFilter={false} className="gap-2">
            <CommandInput
              ref={ref}
              value={search}
              onValueChange={e => {
                setSearch(e)
              }}
              placeholder={props.searchPlaceholder ?? '请输入要搜索的内容'}
            />
            <CommandEmpty>{props.emptyText ?? '没有找到匹配项'}</CommandEmpty>
            <CommandGroup className="pt-2">
              <ScrollArea>
                <div className="max-h-60">
                  {filteredOptions.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value.toLowerCase().trim()}
                      onSelect={selectedValue => {
                        const option = props.options.find(
                          option =>
                            option.value.toLowerCase().trim() === selectedValue,
                        )

                        if (!option) return null

                        if (props.multiple) {
                          handleMultipleSelect(props, option)
                        } else {
                          handleSingleSelect(props, option)

                          setOpen(false)
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 text-base opacity-0',
                          !props.multiple &&
                            props.value === option.value &&
                            'opacity-100',
                          props.multiple &&
                            props.value?.includes(option.value) &&
                            'opacity-100',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </div>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

Combobox.displayName = 'Combobox'
