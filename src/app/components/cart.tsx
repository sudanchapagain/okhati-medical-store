import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type CartProps = {
    open: boolean
    onClose: () => void
}

interface Product {
    id: string;
    name: string;
    href: string;
    price: number;
    quantity: number;
    imageSrc: string;
    imageAlt: string;
}

export default function Cart({ open, onClose }: CartProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open) return

        const fetchCartItems = async () => {
            setLoading(true)
            try {
                const { data: cartItems, error } = await supabase
                    .from('cart_items')
                    .select('*, products(*)')

                if (error) {
                    throw error
                }

                setProducts(cartItems.map(item => ({
                    id: item.products.id,
                    name: item.products.name,
                    href: `/products/${item.products.id}`,
                    price: item.products.price,
                    quantity: item.quantity,
                    imageSrc: item.products.image_url,
                    imageAlt: item.products.name,
                })))
            } catch (err: unknown) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }

        fetchCartItems()
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
                        {products.length === 0 ? (
                            <p className="text-sm text-gray-500">Your cart is empty.</p>
                        ) : (
                            <ul className="-my-6 divide-y divide-gray-200">
                                {products.map((product) => (
                                    <li key={product.id} className="flex py-6">
                                        <div
                                            className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <Image
                                                src={product.imageSrc}
                                                alt={product.imageAlt}
                                                width={96}
                                                height={96}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    <Link href={product.href}>{product.name}</Link>
                                                </h3>
                                                <p>{product.price}</p>
                                            </div>
                                            <div className="flex justify-between text-sm mt-2">
                                                <p className="text-gray-500">Qty {product.quantity}</p>
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
                        <Link
                            href="#"
                            className="relative isolate cursor-default items-baseline justify-center gap-x-2 rounded-lg border px-30 py3 text-base/6 font-semibold text-white bg-green-600 border-green-700 [--btn-hover-overlay:var(--color-white)]/10 before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] data-active:[--btn-icon:var(--color-green-300)] data-active:after:bg-(--btn-hover-overlay) data-disabled:opacity-50 data-disabled:before:shadow-none data-disabled:after:shadow-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-green-500 data-hover:[--btn-icon:var(--color-green-300)] data-hover:after:bg-(--btn-hover-overlay) *:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText] flex py-3"
                        >
                            Checkout
                        </Link>
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