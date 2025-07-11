const stats = [
  { name: "Delivery Across Nepal", value: "77+ Districts" },
  { name: "Customer Support", value: "24/7" },
  { name: "Medical Products Available", value: "5,000+" },
  { name: "Years in Service", value: "3+" },
];

export default function Support() {
  return (
    <div
      id="about"
      className="relative isolate overflow-hidden bg-green-900 py-55 sm:py-55"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
      </div>

      <div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#bbf451] to-[#d4f0ee] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-black sm:text-7xl">
            Okhati in numbers
          </h2>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            We are on a mission to make quality healthcare products accessible
            across Nepal. From essential supplies to specialized equipment,
            Okhati delivers trusted medical solutions with speed and care.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-500">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-black">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
