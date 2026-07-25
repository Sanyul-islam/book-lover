import { Card, Chip } from "@heroui/react";
import { BookOpen, Truck, ShieldCheck, Users, Star } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Huge Collection",
    description:
      "Explore thousands of books across fiction, science, history, and more.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your favorite books delivered quickly and safely to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    description:
      "Every book is carefully selected to ensure the best reading experience.",
  },
  {
    icon: Users,
    title: "Book Community",
    description:
      "Join a community of passionate readers and share your experiences.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <Chip
          className="rounded-full px-4 py-2 font-semibold text-sm mb-4"
          color="primary"
          variant="flat"
        >
         <Star size={20} />
          <h2>Choose Us</h2>
        </Chip>
        <h2 className="text-3xl font-bold">Why Choose Book Lover?</h2>

        <p className="text-default-500 mt-2">
          Everything you need for your perfect reading journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card key={index} className="p-6 text-center">
              <Icon className="mx-auto mb-4" size={40} />

              <h3 className="font-bold text-xl">{item.title}</h3>

              <p className="text-default-500 mt-2">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
