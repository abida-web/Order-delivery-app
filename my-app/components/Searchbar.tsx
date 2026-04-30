"use client ";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface QueryProps {
  id: string;
  product: string;
  customerName: string;
  customerPhone: string;
}
const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (query.length < 2) {
      setResult([]);
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResult(data);
      } catch (error) {
        console.log(error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        type="text"
        placeholder="Search order with details..."
        className="block w-full lg:ml-0 ml-15 pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E9B13B] focus:border-transparent"
      />
      {query && result.length > 0 && (
        <div className="z-50 bg-black  absolute w-full p-3">
          {result.map((res: QueryProps) => (
            <Link
              href={`/dashboard/orders/${res.id}`}
              key={res.id}
              className=" "
            >
              <h1 className=" font-semibold">{res.product}</h1>
              <div className=" flex gap-5 border-b pb-2">
                <p className=" text-xs text-gray-400">{res.customerName}</p>
                <p className=" text-xs text-gray-400">{res.customerPhone}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Searchbar;
