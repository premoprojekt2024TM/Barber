import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Main() {
  const scrollToNextSection = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      id="Main"
      className="relative min-h-screen w-full overflow-hidden flex items-center"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/MainBG2.png"
          alt="Background"
          className="absolute w-full h-full object-cover z-0 top-0 left-0 scale-x-[-1] brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-black/40 z-1"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-80"></div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-10 h-full flex flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-grow relative min-h-screen">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative px-4 md:px-8 lg:px-12 w-full flex items-center order-2 md:order-1"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-white px-6 py-8 md:px-8 md:py-10 w-full relative overflow-hidden group backdrop-blur-sm"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-white to-white/0"></div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold mb-6 tracking-tight"
              >
                <span className="relative">
                  Barber & Blade
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "5rem" }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute -bottom-2 left-0 h-[3px] bg-white"
                  ></motion.span>
                </span>
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-5 leading-relaxed text-gray-300 text-base md:text-lg"
              >
                A Barberkereső applikáció segít könnyedén megtalálni a legjobb
                borbélyszalonokat és fodrászatokat a közeledben, lehetőséget
                biztosítva a szolgáltatások, vélemények és elérhetőségek gyors
                böngészésére.
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="leading-relaxed text-gray-300 text-base md:text-lg mb-8"
              >
                Találd meg a stílusodhoz illő szakembert pár egyszerű lépésben!
              </motion.p>
              <motion.button
                onClick={scrollToNextSection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 md:px-8 md:py-3 bg-white text-black font-semibold text-base md:text-lg relative overflow-hidden group transition-all duration-300 hover:bg-gray-200"
              >
                <span className="relative z-10">FELFEDEZÉS</span>
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-auto md:h-screen overflow-hidden flex justify-center items-center relative z-[5] w-full order-1 md:order-2"
          >
            <div className="absolute inset-0 right-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10 pointer-events-none"></div>
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/MainImage.png"
                alt="Highlight Image"
                className="h-48 md:h-full w-full object-cover absolute right-0"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center col-span-full"
          >
            <motion.div
              onClick={scrollToNextSection}
              animate={{
                y: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="cursor-pointer"
            >
              <ChevronDown className="text-white w-6 h-6 md:w-8 md:h-8" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
