import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

type Product = {
    id: number
    name: string
    href: string
    price: string
    quantity: number
    imageSrc: string
    imageAlt: string
}

type CartProps = {
    open: boolean
    onClose: () => void
}

const m = [
    {
        id: 1,
        name: "Throwback Hip Bag",
        href: "#",
        price: "$90.00",
        quantity: 1,
        imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
        imageAlt: "Salmon orange bag"
    },
    {
        id: 2,
        name: "Medium Stuff Satchel",
        href: "#",
        price: "$32.00",
        quantity: 1,
        imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
        imageAlt: "Blue satchel bag"
    },
    {
        id: 3,
        name: "Medium Satchel",
        href: "#",
        price: "$32.00",
        quantity: 1,
        imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
        imageAlt: "Blue satchel bag"
    }
]
export default function Cart({ open, onClose }: CartProps) {
    const [setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /*useEffect(() => {
      if (!open) return

      const fetchCart = async () => {
        try {
          setLoading(true)
          const res = await fetch("/api/cart")
          if (!res.ok) throw new Error("Failed to fetch cart items")
          const data = await res.json()
          setProducts(data.products || [])
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      fetchCart()
    }, [open])
    */
    useEffect(() => {
        if (!open) return

        const loadMockCart = async () => {
            setLoading(true)
            try {
                // Simulate network delay
                await new Promise((res) => setTimeout(res, 500))

                // Use mock data
                setProducts(m)
            } catch (err) {
                setError("Unexpected error" + err)
            } finally {
                setLoading(false)
            }
        }

        loadMockCart()
    }, [open])


    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-4 overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-semibold text-gray-900">Shopping Cart</Dialog.Title>
                    <button onClick={onClose}>
                        <XMarkIcon className="size-6 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <>
                        {m.length === 0 ? (
                            <p className="text-sm text-gray-500">Your cart is empty.</p>
                        ) : (
                            <ul className="-my-6 divide-y divide-gray-200">
                                {m.map((m) => (
                                    <li key={m.id} className="flex py-6">
                                        <div
                                            className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={m.imageSrc}
                                                alt={m.imageAlt}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    <a href={m.href}>{m.name}</a>
                                                </h3>
                                                <p>{m.price}</p>
                                            </div>
                                            <div className="flex justify-between text-sm mt-2">
                                                <p className="text-gray-500">Qty {m.quantity}</p>
                                                <button className="text-green-600 hover:text-green-500 text-sm">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>$262.00</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6 text-center">
                        <a
                            href="#"
                            className="relative isolate inline-flex cursor-default items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-(--btn-border) px-30 py3 text-base/6 font-semibold text-white bg-green-600 border-green-700 [--btn-hover-overlay:var(--color-white)]/10 before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] data-active:[--btn-icon:var(--color-green-300)] data-active:after:bg-(--btn-hover-overlay) data-disabled:opacity-50 data-disabled:before:shadow-none data-disabled:after:shadow-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-green-500 data-hover:[--btn-icon:var(--color-green-300)] data-hover:after:bg-(--btn-hover-overlay) *:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText] flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white"
                        >
                            Checkout
                        </a>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                            or{' '}
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
