import { useState, useEffect } from "react";
import { Feature, IndexState } from "./MainTypes";
import { CircleArrowRight } from "lucide-react";

const features: Feature[] = [
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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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
    feature-card relative overflow-hidden rounded-lg transition-all duration-500
    ${isMobile && activeIndex === index ? "scale-105 shadow-xl" : ""}
    ${!isMobile ? "hover:scale-105 hover:shadow-xl" : ""}
  `;

  return (
    <div id="FeatureCards" className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Szolgáltatásaink</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="w-full md:w-1/2 max-w-md">
            <div
              data-index={index}
              className={getCardClass(index)}
              style={{ height: "500px" }}
              onMouseEnter={() => !isMobile && setHoverIndex(index)}
              onMouseLeave={() => !isMobile && setHoverIndex(null)}
            >
              <div className="relative h-full w-full">
                <img
                  src={feature.image}
                  alt={feature.text}
                  className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${
                    !isMobile && hoverIndex === index
                      ? "filter brightness-50"
                      : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 rounded-lg"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{feature.text}</h3>

                  <div
                    className={`flex items-center transition-all duration-500 ${
                      (isMobile && activeIndex === index) ||
                      (!isMobile && hoverIndex === index)
                        ? "translate-x-2"
                        : "translate-x-0"
                    }`}
                  >
                    <a
                      href={feature.linkGoto}
                      className="flex items-center group"
                    >
                      <span className="text-white font-medium mr-2 group-hover:underline">
                        Tovább
                      </span>
                      <CircleArrowRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
