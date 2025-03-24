export default function Main() {
  return (
    <div id="Main" className="relative pt-5 overflow-hidden">
      <img
        src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/MainBG2.png"
        alt="Background"
        className="absolute w-full h-full object-cover z-0 top-0 left-0 scale-x-[-1] blur-sm bg-fixed"
      />

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative mt-[120px] md:mt-0 px-4 md:px-8 lg:px-12 w-full">
            <div className="text-white px-4 py-5 bg-[rgba(70,70,75,0.65)] backdrop-blur-lg rounded-lg shadow-xl w-full">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Barber & Blade
              </h2>
              <p className="mb-3 leading-relaxed">
                A Barberkereső applikáció segít könnyedén megtalálni a legjobb
                borbélyszalonokat és fodrászatokat a közeledben, lehetőséget
                biztosítva a szolgáltatások, vélemények és elérhetőségek gyors
                böngészésére.
              </p>
              <p className="leading-relaxed">
                Találd meg a stílusodhoz illő szakembert pár egyszerű lépésben!
              </p>
            </div>
          </div>

          <div className="h-[500px] md:h-[600px] overflow-hidden flex justify-center items-center pt-14 relative z-[5] -mt-[170px] md:mt-0 w-full">
            <img
              src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/MainImage.png"
              alt="Highlight Image"
              className="h-full w-full object-cover absolute right-0 mt-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
