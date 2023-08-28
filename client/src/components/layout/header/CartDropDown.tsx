import api from "@/api/api";
import NumberInput from "@/components/common/NumberInput";
import { AnimatedProgressIcon, CartIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { shortenName } from "@/lib/utils";
import { FC, useEffect, useState } from "react";

const CartDropDown: FC = () => {
  const { isLoggedIn } = useUser();
  const [cartDropDownOpen, setCartDropDownOpen] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cart, setCart] = useState<CartItem[] | null>(null);

  const totalItems = cart?.reduce((acc, item) => acc + item.quantity, 0);
  const totalCost = cart?.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  useEffect(() => {
    if (cartDropDownOpen) {
      setLoadingCart(true);

      api.get("/cart").then((data) => {
        const cartData = data as Cart;
        setCart(cartData.items);
        setLoadingCart(false);
      });
    }
  }, [cartDropDownOpen]);

  return (
    <Dialog
      open={cartDropDownOpen}
      onOpenChange={() => {
        setCartDropDownOpen(!cartDropDownOpen);
      }}
    >
      <DialogTrigger disabled={!isLoggedIn}>
        <CartIcon
          interactive
          className={
            !isLoggedIn ? "cursor-not-allowed opacity-20 hover:text-white" : ""
          }
        />
      </DialogTrigger>
      <DialogContent className="z-[70] px-7 py-8">
        {loadingCart ? (
          <div className="flex items-center justify-center text-center">
            <AnimatedProgressIcon className="text-accent" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold uppercase tracking-[0.08038rem]">
                Cart ({totalItems || 0})
              </span>
              <Button
                variant="link"
                size="min"
                disabled={!cart || cart.length === 0}
                className="text-[0.9375rem] font-medium leading-6 underline underline-offset-1 opacity-50 transition-all hover:text-accent hover:opacity-100 disabled:opacity-10"
                onClick={() => {
                  if (cart) {
                    setLoadingCart(true);
                    api.delete(`/cart`).then(() => {
                      setCart(null);
                      setLoadingCart(false);
                    });
                  }
                }}
              >
                Remove all
              </Button>
            </div>
            <div className="mb-8">
              {cart &&
                cart.map((item) => (
                  <div key={item.slug} className="flex items-center gap-4">
                    <img
                      src={`/product-${item.slug}/desktop/image-product.jpg`}
                      alt={item.name}
                      className="mr-4 h-16 w-16 rounded-lg"
                    />
                    <div className="font-bold leading-[1.5625rem]">
                      <p className="text-[0.9375rem] ">
                        {shortenName(item.name)}
                      </p>
                      <p className="text-sm opacity-50">
                        £{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <NumberInput
                      className="ml-auto h-8 w-24"
                      min={1}
                      max={10}
                      value={item.quantity}
                      setValue={(val) =>
                        api
                          .patch(`/cart/update/${item.id}`, {
                            quantity: val,
                          })
                          .then((data) => {
                            const cartData = data as Cart;
                            setCart(cartData.items);
                          })
                      }
                    />
                  </div>
                ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                Total
              </span>
              <span className="text-lg font-bold">
                £{Number(totalCost || 0).toLocaleString()}
              </span>
            </div>
            <Button className="w-full">Checkout</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartDropDown;
