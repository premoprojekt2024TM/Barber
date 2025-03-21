export default function Main() {
  return (
    <div id="Main" className="relative pt-5 overflow-hidden">
      <img
        src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/MainBG2.png"
        alt="Background"
        className="absolute w-full h-full object-cover z-0 top-0 left-0 scale-x-[-1] blur-sm"
      />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="px-3 md:px-6">
            <div className="text-white px-4 md:px-5 py-5 mx-3 md:mx-6 md:mr-8 bg-[rgba(70,70,75,0.65)] backdrop-blur-lg rounded-lg shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Barberkereső
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
          <div className="h-[600px] overflow-hidden flex justify-center items-center pt-14 relative z-10">
            <img
              src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/MainImage.png"
              alt="Highlight Image"
              className="h-[500px] w-full object-cover absolute right-0 mt-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
