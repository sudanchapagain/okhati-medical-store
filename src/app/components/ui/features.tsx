import {
  ShoppingBagIcon,
  CheckBadgeIcon,
  TruckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Wide Range of Products",
    description:
      "From basic supplies to advanced medical equipment, find everything you need in one place.",
    icon: ShoppingBagIcon,
  },
  {
    name: "Trusted Quality",
    description:
      "We stock only certified and reliable products from reputable healthcare brands.",
    icon: CheckBadgeIcon,
  },
  {
    name: "Fast & Easy Ordering",
    description:
      "Order online or in-store with a smooth, hassle-free experience every time.",
    icon: TruckIcon,
  },
  {
    name: "Personalized Support",
    description:
      "Need help choosing the right product? Our team is here to guide you with care.",
    icon: UserIcon,
  },
];

export default function FeatureBlock() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-green-600">
            Purchase with ease
          </h2>
          <p className="mt-2 text-4xl font-bold text-pretty text-gray-900 sm:text-5xl lg:text-balance">
            Everything you need in one single place
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Okhati Medical Store is committed to delivering trusted medical
            equipment solutions with ease and reliability.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-green-600">
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
