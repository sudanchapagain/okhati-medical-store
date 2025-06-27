import Image from 'next/image';
import Link from 'next/link';
import {useKeenSlider} from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid'
import {ArrowUturnLeftIcon, TagIcon} from '@heroicons/react/24/outline'



interface Product {
    id: string;
    name: string;
    image_urls: string[];
    price: number;
    category: string;
    stock: number;
    description: string;
}

export default function ProductDetails({ product }: { product: Product }) {
    const [sliderRef, slider] = useKeenSlider({
        loop: true,
        slides: {
            perView: 1,
            spacing: 10,
        },
    })

    const goPrev = () => slider.current?.prev()
    const goNext = () => slider.current?.next()


    return (
        <div className="bg-white">
            <div className="pt-24 pb-16">
                <div className="bg-white p-8 space-y-8 max-w-6xl mx-auto">
                    <Link href="/products"><p className="bg-gray-500 font-bold text-gray-100 px-4 mb-4 text-sm py-2 rounded-full max-w-28"><ArrowUturnLeftIcon className="text-gray-100 h-4 w-6 mb-1 inline"/>Return</p></Link>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="relative">
                            <div ref={sliderRef}
                                 className="keen-slider rounded-md border border-green-100 overflow-hidden">
                                {product.image_urls.map((img: string, i: number) => (
                                    <div key={i}
                                         className="keen-slider__slide flex justify-center items-center bg-gray-50">
                                        <Image
                                            src={img}
                                            alt={product.name}
                                            width={500}
                                            height={500}
                                            className="max-h-[500px] w-auto object-contain"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={goPrev}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100"
                            >
                                <ChevronLeftIcon className="h-6 w-6 text-gray-700"/>
                            </button>
                            <button
                                onClick={goNext}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100"
                            >
                                <ChevronRightIcon className="h-6 w-6 text-gray-700"/>
                            </button>

                        </div>

                        <div className="space-y-6">
                            <h1 className="text-3xl mb-0.5 font-bold tracking-tight text-gray-900">{product.name}</h1>
                            <p className="text-base text-gray-700"><TagIcon className="size-5 inline mr-2"/>{product.category}</p>
                            <p className="text-3xl font-bold tracking-tight text-gray-900">{product.price}</p>
                            <p className="text-base text-gray-700 text-green-800">In stock: {product.stock > 0 ? 'Yes' : 'No'}</p>

                            <button
                                type="button"
                                className="w-full rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white hover:bg-green-700"
                            >
                                Add to cart
                            </button>

                            <p className="text-base text-gray-700">{product.description}</p>
                        </div>
                    </div>

                    <div className="border-t border-green-200 pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                            <li>{product.description}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
