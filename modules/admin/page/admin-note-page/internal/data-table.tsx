'use client'

import type {
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useState } from 'react'
import { DataTablePagination } from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: 'createdAt' },
  ])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // * 分页
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    // * 排序
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    meta: {},
  })

  return (
    <div className="paper-card p-3 md:p-4">
      <div className="overflow-hidden rounded-[22px] border border-white/80 bg-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] dark:border-white/12 dark:bg-white/[0.04]">
        <Table>
          <TableHeader className="bg-black/[0.03] dark:bg-white/[0.04]">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-foreground/48 dark:text-white/64"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* 后序再骨架屏效果 */}
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      className="border-white/50 dark:border-white/8"
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="text-foreground/74">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="p-6"
                    >
                      <div className="flex min-h-32 flex-col items-center justify-center rounded-[18px] border border-dashed border-black/8 bg-black/[0.015] px-4 text-center dark:border-white/10 dark:bg-white/[0.015]">
                        <span className="paper-label">empty</span>
                        <p className="paper-title mt-4 text-2xl">暂时没有笔记</p>
                        <p className="mt-2 text-sm text-foreground/52">可以先创建一篇草稿，再慢慢补正文。</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
