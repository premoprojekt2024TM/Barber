import * as React from "react";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const handleChange = (panel: string) => {
    setExpanded(
      expanded.includes(panel)
        ? expanded.filter((item) => item !== panel)
        : [...expanded, panel],
    );
  };

  return (
    <div className="relative py-12">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png)",
          maxHeight: "100%",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="w-full max-w-3xl mx-auto py-8 md:py-12 px-4 flex flex-col items-center gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Gyakran ismételt kérdések
            </h2>

            <div className="w-full space-y-3">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/90">
                <div
                  className="cursor-pointer"
                  onClick={() => handleChange("panel1")}
                >
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50/80">
                    <span className="font-medium text-gray-900">
                      Hogyan érhetem el az ügyfélszolgálatot, ha kérdésem vagy
                      problémám van?
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${expanded.includes("panel1") ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                {expanded.includes("panel1") && (
                  <div className="p-4 bg-gray-50/80 border-t border-gray-200">
                    <p className="text-gray-700">
                      Az ügyfélszolgálatunkat e-mailben érheted el a{" "}
                      <a
                        href="mailto:support@email.com"
                        className="text-blue-600 hover:underline"
                      >
                        support@email.com
                      </a>{" "}
                      címen, vagy telefonon, a toll-free számunkon keresztül.
                      Munkatársaink gyorsan segítenek.
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/90">
                <div
                  className="cursor-pointer"
                  onClick={() => handleChange("panel2")}
                >
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50/80">
                    <span className="font-medium text-gray-900">
                      Lehetőségem van lemondani a lefoglalt szolgáltatásomat?
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${expanded.includes("panel2") ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                {expanded.includes("panel2") && (
                  <div className="p-4 bg-gray-50/80 border-t border-gray-200">
                    <p className="text-gray-700">
                      A szolgáltatás lemondására lehetőség van, kérjük, vedd fel
                      a kapcsolatot az alkalmazásunkon keresztül a
                      szolgáltatóval.
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/90">
                <div
                  className="cursor-pointer"
                  onClick={() => handleChange("panel3")}
                >
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50/80">
                    <span className="font-medium text-gray-900">
                      Milyen szolgáltatásokat találhatok az alkalmazásban, és
                      hogyan tudok rendelni?
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${expanded.includes("panel3") ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                {expanded.includes("panel3") && (
                  <div className="p-4 bg-gray-50/80 border-t border-gray-200">
                    <p className="text-gray-700">
                      Az alkalmazásban különböző kategóriákban találhatók
                      szolgáltatások, például éttermek, wellness, szépségápolás
                      és egyéb. A rendeléshez válaszd ki a kívánt szolgáltatást,
                      majd kövesd az egyszerű lépéseket a foglaláshoz.
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/90">
                <div
                  className="cursor-pointer"
                  onClick={() => handleChange("panel4")}
                >
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50/80">
                    <span className="font-medium text-gray-900">
                      Hogyan találom meg a legközelebbi szolgáltatásokat az
                      alkalmazásban?
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${expanded.includes("panel4") ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                {expanded.includes("panel4") && (
                  <div className="p-4 bg-gray-50/80 border-t border-gray-200">
                    <p className="text-gray-700">
                      Az alkalmazásban a legközelebbi szolgáltatásokat a
                      tartózkodási helyed alapján találhatod meg, vagy
                      manuálisan beállíthatod a helyszínt a szűrők segítségével.
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/90">
                <div
                  className="cursor-pointer"
                  onClick={() => handleChange("panel5")}
                >
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50/80">
                    <span className="font-medium text-gray-900">
                      Milyen visszajelzéseket találhatok más felhasználóktól a
                      szolgáltatásokról?
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${expanded.includes("panel5") ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                {expanded.includes("panel5") && (
                  <div className="p-4 bg-gray-50/80 border-t border-gray-200">
                    <p className="text-gray-700">
                      Az alkalmazásban felhasználói értékelések és vélemények
                      találhatók minden szolgáltatásról, melyek segítenek a
                      legjobb döntés meghozatalában.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
