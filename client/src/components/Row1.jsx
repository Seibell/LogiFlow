import { useGetHelloQuery, useGetKpisQuery } from "../state/api";
import DashboardBox from "./DashboardBox";

const Row1 = () => {
  // const { data } = useGetKpisQuery();
  console.log(useGetHelloQuery());
  return (
    <>
      <DashboardBox gridArea="a"></DashboardBox>
      <DashboardBox gridArea="b"></DashboardBox>
      <DashboardBox gridArea="c"></DashboardBox>
    </>
  );
};

export default Row1;
