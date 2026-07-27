"use client";

import { Chip } from "@heroui/react";
import { Lightbulb, Brain, MessageCircle, Sparkles, Gift } from "lucide-react";

export default function ReadingBenefits() {
  const benefits = [
    {
      title: "Improves Knowledge & Creativity",
      description:
        "Reading expands your imagination and helps you discover new ideas.",
      icon: Lightbulb,
    },
    {
      title: "Reduces Stress & Improves Focus",
      description: "Books help you relax your mind and increase concentration.",
      icon: Brain,
    },
    {
      title: "Develops Communication Skills",
      description:
        "Reading improves vocabulary and makes your communication stronger.",
      icon: MessageCircle,
    },
    {
      title: "Discover New Perspectives",
      description: "Explore different cultures, stories, and ways of thinking.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-20 bg-default-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Chip
            className="rounded-full px-4 py-2 font-semibold text-sm mb-4"
            color="primary"
            variant="flat"
          >
           <Gift size={20} />
            <h2>Benefits</h2>
          </Chip>

          <h2 className="text-3xl md:text-4xl font-bold">
            Benefits of Reading Books
          </h2>

          <p className="text-default-500 mt-3 max-w-xl mx-auto">
            Discover how reading books can improve your knowledge, creativity,
            and everyday life.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  group
                  bg-background
                  rounded-2xl
                  p-6
                  shadow-sm
                  border
                  border-default-200
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                  flex
                  items-start
                  gap-5
                "
                >
                  <div
                    className="
                      p-3
                      rounded-xl
                      bg-primary/10
                      text-primary
                      group-hover:bg-primary
                      group-hover:text-sky-500
                      transition-colors
                    "
                  >
                    <Icon size={28} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>

                    <p className="text-default-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
