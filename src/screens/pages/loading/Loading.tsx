import { HashLoader } from "react-spinners";

export default function Loading() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  return <HashLoader color="#28c6c1" size={150} cssOverride={style} />;
}
