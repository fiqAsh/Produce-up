import { useEffect } from "react";
import DeliveryOrderComponent from "../components/DeliveryOrderComponent";
import Navbar from "../components/Navbar";
import { useUserStore } from "../stores/useUserStore";

const Home = () => {
  const { markets, fetchAllMarkets } = useUserStore();
  useEffect(() => {
    fetchAllMarkets();
  }, []);
  return (
    <div>
      <Navbar />
      <DeliveryOrderComponent markets={markets} />
    </div>
  );
};

export default Home;
