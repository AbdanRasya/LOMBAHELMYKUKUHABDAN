"use client";

import { useState } from "react";
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Eye, Ban, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockUsers = Array.from({ length: 15 }).map((_, i) => ({
  id: i.toString(),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "COMPANY" : i % 5 === 0 ? "ADMIN" : "UMKM",
  status: i === 3 ? "Suspended" : "Active",
  joinedDate: "2026-01-10",
  avatar: `U${i + 1}`
}));

export default function AdminUsersPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [data] = useState(mockUsers);

  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }: any) => (
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
          {row.getValue("avatar")}
        </div>
      )
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => {
        const role = row.getValue("role");
        return (
          <Badge variant={role === "ADMIN" ? "destructive" : role === "COMPANY" ? "default" : "secondary"}>
            {role}
          </Badge>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge variant={status === "Active" ? "outline" : "destructive"}>
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "joinedDate",
      header: "Joined Date",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center hover:bg-slate-100 rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Ban className="mr-2 h-4 w-4" /> Suspend User
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <div className="flex items-center py-4 gap-2">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100"
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
