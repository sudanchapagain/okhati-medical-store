import Landing from "./components/ui/landing";
import FeatureBlock from "./components/ui/features";
import Support from "./components/ui/support";
import Header from "./components/ui/header";
import Footer from "./components/ui/footer"
import Contact from "./components/ui/contact";
import CategoryProductList from "./components/category_product_list";

export default function Home() {
  return (
    <>
      <Header />
      <Landing />
      <FeatureBlock />
      <CategoryProductList />
      <Support />
      <Contact />
      <Footer />
    </>
  );
}
