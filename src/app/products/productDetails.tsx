import {useKeenSlider} from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid'
import {ArrowUturnLeftIcon, TagIcon} from '@heroicons/react/24/outline'
import { Link } from "react-router-dom"

const product = {
    name: 'Amoxicilin 250mg Capsules',
    price: 'NPR 192',
    instock: true,
    category: 'Medicine and Supplements',
    images: [
        {
            src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
            alt: 'Model wearing plain white basic tee.',
        },
    ],
    description:
        'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
    details: [
        'Hand cut and sewn locally',
        'Dyed with our proprietary colors',
        'Pre-washed & pre-shrunk',
        'Ultra-soft 100% cotton',
    ],
}

export default function ProductDetails() {
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
                    <Link to="/products"><p className="bg-gray-500 font-bold text-gray-100 px-4 mb-4 text-sm py-2 rounded-full max-w-28"><ArrowUturnLeftIcon className="text-gray-100 h-4 w-6 mb-1 inline"/>Return</p></Link>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="relative">
                            <div ref={sliderRef}
                                 className="keen-slider rounded-md border border-green-100 overflow-hidden">
                                {product.images.map((img, i) => (
                                    <div key={i}
                                         className="keen-slider__slide flex justify-center items-center bg-gray-50">
                                        <img
                                            src={img.src}
                                            alt={img.alt}
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
                            <p className="text-base text-gray-700 text-green-800">In stock: {product.instock ? 'Yes' : 'No'}</p>

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
                            {product.details.map((detail) => (
                                <li key={detail}>{detail}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
