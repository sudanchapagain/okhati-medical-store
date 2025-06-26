import Link from "next/link";

export default function Landing() {
  return (
    <>
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#bbf451] to-[#d4f0ee] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            />
          </div>
          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <span className="inline-flex items-center gap-x-1.5 rounded-md bg-lime-400/20 px-2 py-0.5 text-sm/5 font-medium text-lime-700 group-data-hover:bg-lime-400/30 sm:text-xs/5 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-hover:bg-lime-400/15 forced-colors:outline">
                New products in stock
              </span>
              <h1 className="text-5xl font-bold tracking-tight text-balance text-gray-900 sm:text-7xl">
                One stop solution for Medical products.
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                Your one stop shop for all medical supplies and medications. We
                are committed to providing quality products for your health and
                wellbeing
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/products"
                  className="relative isolate inline-flex cursor-default items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-(--btn-border) px-10 py-[calc(--spacing(2.5)-1px)] text-base/6 font-semibold text-white [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90 [--btn-hover-overlay:var(--color-white)]/10 [--btn-icon:var(--color-green-400)] before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] focus:not-data-focus:outline-hidden data-active:[--btn-icon:var(--color-green-300)] data-active:after:bg-(--btn-hover-overlay) data-disabled:opacity-50 data-disabled:before:shadow-none data-disabled:after:shadow-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-green-500 data-hover:[--btn-icon:var(--color-green-300)] data-hover:after:bg-(--btn-hover-overlay) *:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]"
                >
                  Buy now!
                </Link>
                <a
                  href="#about"
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#bbf451] to-[#d4f0ee] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            />
          </div>
        </div>
      </div>
      <div className="relative mx-auto mb-12 aspect-video w-full max-w-6xl overflow-hidden rounded shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black to-black">
          <span className="block max-w-60 rounded-full bg-white p-4 pr-12 pl-12 text-center text-black">
            VIDEO PREVIEW
          </span>
        </div>
      </div>
    </>
  );
}
