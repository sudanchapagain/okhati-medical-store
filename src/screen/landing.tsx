import Main from "@/components/home/main";
import FeatureBlock from "@/components/home/features";
import CategoryProductList from "@/components/home/category_product_list";
import Support from "@/components/home/support";
import Contact from "@/components/home/contact";

export default function Landing() {
  return (
    <>
      <Main />
      <FeatureBlock />
      <CategoryProductList />
      <Support />
      <Contact />
    </>
  );
}
