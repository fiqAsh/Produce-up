import { useEffect } from "react";
import DeliveryOrderComponent from "../components/DeliveryOrderComponent";
import Navbar from "../components/Navbar";
import { useUserStore } from "../stores/useUserStore";
import LowestPriceFinder from "../components/LowestPriceFinder";

const Home = () => {
  const { markets, fetchAllMarkets } = useUserStore();
  useEffect(() => {
    fetchAllMarkets();
  }, []);
  return (
    <div>
      <Navbar />
      <DeliveryOrderComponent markets={markets} />
      <LowestPriceFinder />
    </div>
  );
};

export default Home;
