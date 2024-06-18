"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/GHXhZDO4KL4
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { debounce } from "lodash";
import { X } from "lucide-react";

export function SearchBox({
  query,
  disabled,
}: {
  query?: string | null;
  disabled?: boolean;
}) {
  const [input, setInput] = useState(query ?? "");
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const validQuery = input.length > 2;

  const router = useRouter();

  const search = debounce(() => {
    if (input !== query) {
      startTransition(() => {
        let newParams = new URLSearchParams([["q", input]]);
        input.length === 0 ? router.push("/") : router.push(`?${newParams}`);
      });
    }
  }, 300);

  const resetQuery = () => {
    startTransition(() => {
      setInput("");
      router.push(`/`);
      router.refresh();
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    if (validQuery) {
      search();
    }
    if (input.length === 0 && query) {
      resetQuery();
    }
    return () => {
      search.cancel();
    };
  }, [input]);

  return (
    <div className="flex flex-col">
      <form
        className="w-full mx-auto mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (validQuery) search();
        }}
      >
        <div className="relative flex items-center space-x-2">
          <div className="relative w-full flex items-center">
            <SearchIcon className="absolute left-4 w-5 h-5 text-gray-500" />
            <Input
              disabled={disabled}
              ref={inputRef}
              autoFocus
              value={input}
              minLength={3}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.metaKey && event.key === "Backspace") {
                  resetQuery();
                }
              }}
              className={
                "text-base w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
              }
              placeholder="Search..."
            />
            {input.length > 0 ? (
              <Button
                className="absolute right-2 text-gray-400 rounded-full h-8 w-8"
                variant="ghost"
                type="reset"
                size={"icon"}
                onClick={() => resetQuery()}
              >
                <X height="20" width="20" />
              </Button>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
