const callouts = [
  {
    name: "Medical Equipments",
    description: "Weighing machines, Thermometers, etc.",
    imageSrc:
      "https://images.unsplash.com/photo-1657028310103-f53dd49a856a?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "/products?category=me",
  },
  {
    name: "Medicine and Supplements",
    description: "Medicinal pills, Tablets, and more.",
    imageSrc:
      "https://images.unsplash.com/photo-1618675522955-3eafc0957767?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Few strips of medicine tablets.",
    href: "/products?category=ms",
  },
  {
    name: "Personal care and Hygiene",
    description: "Sanitary napkins, Masks, Soaps. ",
    imageSrc:
      "https://images.unsplash.com/photo-1604116395843-94f7b28a8080?q=80&w=2448&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
    href: "/products?category=ch",
  },
];

export default function CategoryProductList() {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">
            Explore by category
          </h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
            {callouts.map((callout) => (
              <div key={callout.name} className="group relative">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-lg bg-red-500 opacity-1 mix-blend-multiply" />
                  <img
                    alt={callout.imageAlt}
                    src={callout.imageSrc}
                    width={500}
                    height={500}
                    className="relative z-0 w-full rounded-lg border border-gray-500/25 bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                  <a href={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                  </a>
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {callout.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
