"use client"
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/select";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Eye, Download, Edit } from "lucide-react";
import useAuthTokenVerification from "../../../hooks/useAuthVerification"

const languages = [
  { code: "ca", name: "Inuktitut", done: 10, total: 3311, progress: 0 },
  { code: "it", name: "Italian", done: 1366, total: 3311, progress: 41 },
  { code: "mn", name: "Mongolian", done: 10, total: 3311, progress: 0 },
  { code: "za", name: "Northern Sotho", done: 10, total: 3311, progress: 0 },
  { code: "no", name: "Norwegian", done: 1187, total: 3311, progress: 36 },
  { code: "pl", name: "Polish", done: 1506, total: 3311, progress: 45 },
  { code: "pt", name: "Portuguese", done: 902, total: 3311, progress: 27 },
  { code: "br", name: "Portuguese-brazilian", done: 1538, total: 3311, progress: 46 },
  { code: "ro", name: "Romanian", done: 1118, total: 3311, progress: 34 },
  { code: "ru", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "ra", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "rb", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "rc", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "rd", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "re", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "reb", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "ref", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "red", name: "Russian", done: 1499, total: 3311, progress: 45 },
  { code: "rae", name: "Russian", done: 1499, total: 3311, progress: 45 },
];

export default function TranslationsDashboard() {
  useAuthTokenVerification()
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(languages.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = languages.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="p-6 w-full max-w-7xl mx-auto overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl font-semibold">Translations</h1>
        <Button className="bg-[#FF7052] hover:bg-[#FF7052]/90">Add Translation</Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <Select value={entriesPerPage.toString()} onValueChange={(value) => {
            setEntriesPerPage(parseInt(value));
            setCurrentPage(1); // Reset to first page when changing entries per page
          }}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">entries</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm">Search:</span>
          <Input className="w-full sm:w-[200px]"/>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="h-8">
              <TableHead className="w-[200px]">Language</TableHead>
              <TableHead className="w-[250px]">Progress</TableHead>
              <TableHead className="w-[80px]">Done</TableHead>
              <TableHead className="w-[80px]">Total</TableHead>
              <TableHead className="w-[120px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEntries.map((language) => (
              <TableRow key={language.code} className="h-8">
                <TableCell className="py-1 flex items-center gap-2">
                  <img src={`/flags/${language.code}.png`} alt={language.name} className="w-5 h-3" />
                  {language.name}
                </TableCell>
                <TableCell className="py-1">
                  <div className="w-[200px] h-[5px] bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${language.progress}%` }} />
                  </div>
                </TableCell>
                <TableCell className="py-1">{language.done}</TableCell>
                <TableCell className="py-1">{language.total}</TableCell>
                <TableCell className="py-1 text-right">
                  <div className="flex justify-end gap-1">
                    <Button className="w-6 h-6 p-1"><Download className="w-3 h-3" /></Button>
                    <Button className="w-6 h-6 p-1"><Eye className="w-3 h-3" /></Button>
                    <Button className="w-6 h-6 p-1"><Edit className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <div className="flex gap-2">
          <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
