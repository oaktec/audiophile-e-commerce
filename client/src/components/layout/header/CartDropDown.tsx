import api from "@/api/api";
import { Link } from "@/components/common/Link";
import NumberInput from "@/components/common/NumberInput";
import { TypographyFormSectionHeader } from "@/components/common/Typography";
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
  const isCheckoutPage = window.location.pathname === "/checkout";

  const disableDropDown = !isLoggedIn || isCheckoutPage;

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
      <DialogTrigger disabled={disableDropDown}>
        <CartIcon
          interactive
          className={
            disableDropDown
              ? "cursor-not-allowed opacity-20 hover:text-white"
              : ""
          }
        />
      </DialogTrigger>
      <DialogContent className="z-[70] max-h-[85vh] max-w-[min(24rem,calc(100vw-48px))] overflow-auto px-7 py-8 sm:left-auto sm:right-4 sm:translate-x-0 2xl:translate-x-[calc(700px-50vw)]">
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
              {cart && cart.length > 0 && (
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
              )}
            </div>
            <div className="mb-8 space-y-6">
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
                      className="ml-auto h-8 w-[6rem]"
                      min={0}
                      max={10}
                      value={item.quantity}
                      setValue={(val) =>
                        val === 0
                          ? api
                              .delete(`/cart/remove/${item.id}`)
                              .then((data) => {
                                const cartData = data as Cart;
                                setCart(cartData.items);
                              })
                          : api
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

            {cart && cart.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                    Total
                  </span>
                  <span className="text-lg font-bold">
                    £{Number(totalCost || 0).toLocaleString()}
                  </span>
                </div>
                <Link variant="button" href="/checkout" className="w-full">
                  Checkout
                </Link>
              </>
            ) : (
              <TypographyFormSectionHeader>
                Cart is empty
              </TypographyFormSectionHeader>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartDropDown;
