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
              <span className="">Cart</span>
              <Button variant="link" size="min">
                Remove all
              </Button>
            </div>
            <div className="mb-8">
              {cart &&
                cart.map((item) => (
                  <div key={item.slug} className="flex items-center">
                    <img
                      src={`/product-${item.slug}/desktop/image-product.jpg`}
                      alt={item.name}
                      className="mr-4 h-16 w-16"
                    />
                    <div>
                      <div>{shortenName(item.name)}</div>
                      <div>£{Number(item.price).toLocaleString()}</div>
                    </div>
                    <NumberInput
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
              <span className="">Total</span>
              <span>£0.00</span>
            </div>
            <Button className="w-full">Checkout</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartDropDown;
