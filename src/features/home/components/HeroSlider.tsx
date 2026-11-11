
import { getBanners } from "../../../services/getBanners";
import SwiperList from "./SwiperList";

export default async function HeroSlider() {
  const data = await getBanners();

  return (
    <SwiperList data={data} />
  );
}