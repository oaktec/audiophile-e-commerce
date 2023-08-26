type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: number;
  new: boolean;
  features: string;
};

interface FullProduct extends Product {
  similarProducts: string[];
  boxContents: { item: string; quantity: number }[];
}
