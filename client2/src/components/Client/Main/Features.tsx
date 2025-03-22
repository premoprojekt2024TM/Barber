import { useState, useEffect } from "react";
import { Feature, IndexState } from "./MainTypes";
import { CircleArrowRight } from "lucide-react";

const features: Feature[] = [
  {
    image:
      "https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/Feature1.jpeg",
    text: "Partnereink",
    linkGoto: "https://www.example.com",
  },
  {
    image:
      "https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/Feature2.jpg",
    text: "Térkép",
    linkGoto: "/map",
  },
  {
    image:
      "https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/Feature3.jpg",
    text: "Időpontfoglalás",
    linkGoto: "https://www.example.com",
  },
];

export default function Features() {
  const [activeIndex, setActiveIndex] = useState<IndexState>(null);
  const [hoverIndex, setHoverIndex] = useState<IndexState>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.8 },
    );
    document
      .querySelectorAll(".feature-card")
      .forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isMobile]);

  const getCardClass = (index: number): string => `
    feature-card relative overflow-hidden w-full max-w-sm transition-all duration-300
    ${isMobile && activeIndex === index ? "scale-105 shadow-xl" : ""}
    ${!isMobile ? "hover:scale-105 hover:shadow-xl" : ""}
  `;

  return (
    <div id="FeatureCards" className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex justify-center">
            <div
              data-index={index}
              className={getCardClass(index)}
              style={{ height: "600px" }}
              onMouseEnter={() => !isMobile && setHoverIndex(index)}
              onMouseLeave={() => !isMobile && setHoverIndex(null)}
            >
              <div className="relative h-full w-full">
                <img
                  src={feature.image}
                  alt={feature.text}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    !isMobile && hoverIndex === index ? "blur-sm" : ""
                  }`}
                  style={{
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                  }}
                />
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold transition-opacity duration-300 ${
                    (isMobile && activeIndex === index) ||
                    (!isMobile && hoverIndex === index)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  {feature.text}
                </div>
                {feature.linkGoto && (
                  <div
                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center transition-opacity duration-300 ${
                      (isMobile && activeIndex === index) ||
                      (!isMobile && hoverIndex === index)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <span className="text-white font-bold mr-1">Tovább</span>
                    <a href={feature.linkGoto} className="text-white">
                      <CircleArrowRight className="h-6 w-6 text-white" />{" "}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
