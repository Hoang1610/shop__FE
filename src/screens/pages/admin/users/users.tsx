import { useState } from "react";
import UserInput from "./userInput";
import UserTable from "./userTable";

export default function Users() {
  const [query, setQuery] = useState<string>("");
  const [current, setCurrent] = useState<number>(1);
  return (
    <>
      <UserInput setQuery={setQuery} query={query} setCurrent={setCurrent} />
      <UserTable
        query={query}
        current={current}
        setCurrent={setCurrent}
        setQuery={setQuery}
      />
    </>
  );
}
