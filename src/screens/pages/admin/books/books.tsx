import { useState } from "react";
import BookInput from "./bookInput";
import BookTable from "./bookTable";

export default function Books() {
  const [query, setQuery] = useState<string>("");
  const [current, setCurrent] = useState<number>(1);
  return (
    <>
      <BookInput setQuery={setQuery} query={query} setCurrent={setCurrent} />
      <BookTable
        query={query}
        current={current}
        setCurrent={setCurrent}
        setQuery={setQuery}
      />
    </>
  );
}
