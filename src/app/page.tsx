const heroImage = "/assets/Rectangle 3.png";
const categoryImages = [
  "https://www.figma.com/api/mcp/asset/ae45ce2e-6ad1-4a0d-a8aa-cc92a6715f44.png",
  "https://www.figma.com/api/mcp/asset/c6aa829a-f498-4880-bf01-d34479d6e34c.png",
  "https://www.figma.com/api/mcp/asset/08a0fcf3-69f5-46e9-a664-ecf08649ceb1.png",
  "https://www.figma.com/api/mcp/asset/03a87b13-3a64-41c3-936a-8ba561331820.png",
  "https://www.figma.com/api/mcp/asset/d4bb05ea-eadb-45ec-84a6-b82e5e0ddcad.png",
] as const;

const articleImage =
  "https://www.figma.com/api/mcp/asset/1d0930ab-aa94-49da-af84-10aa9a2f2755.png";
const giftsImage =
  "https://www.figma.com/api/mcp/asset/6f307900-1152-4719-8326-d89697a9a765.png";
const aboutImage =
  "https://www.figma.com/api/mcp/asset/064ce479-46d9-4879-9911-98cf17cb2ce7.png";

const categories = [
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Rings",
  "Charms",
] as const;

export default function HomePage() {
  return (
    <div className="bg-[#f5f1ee] text-[#171312]">
      <section className="relative isolate overflow-hidden bg-[#120d0b]">
        <img
          src={heroImage}
          alt="Jewelry editorial hero"
          className="h-[620px] w-full object-cover md:h-[720px]"
        />
        {/* <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f5f1ee] to-transparent" /> */}

        <div className="absolute inset-0 mx-auto flex max-w-[1512px] items-center px-4 pb-12 pt-16 sm:px-8 lg:px-10">
          <div className="max-w-[560px] text-white">
            <p className="mb-3 text-[16px] font-light tracking-[0.08em] text-white/85 sm:text-[18px]">
              Fall has arrived.
            </p>
            <h1
              className="font-display text-[42px] leading-[0.9] text-white sm:text-[58px] lg:text-[82px]"
              style={{ textShadow: "0 4px 12px rgba(0,0,0,0.35)" }}
            >
              the autumn equinox
            </h1>
            <p className="mt-2 max-w-[420px] text-[15px] font-light text-white/80 sm:text-[17px]">
              Shop for our new releases starting today.
            </p>
            <button className="mt-8 inline-flex items-center justify-center border border-white bg-transparent px-6 py-3 text-[13px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85">
              Shop now
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1ee] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <h2 className="font-display text-[40px] leading-none text-[#171312] sm:text-[48px]">
              Shop by category
            </h2>
            <p className="mt-3 font-display text-[27px] italic text-[#171312]">
              Indulge in what we offer.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {categoryImages.map((image, index) => (
              <a
                key={categories[index]}
                href="#"
                className="group block overflow-hidden rounded-[4px] bg-[#f0e7e1] shadow-[0_6px_18px_rgba(41,31,29,0.08)]"
              >
                <div className="relative h-[318px] overflow-hidden">
                  <img
                    src={image}
                    alt={categories[index]}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="pb-4 pt-3 text-center font-display text-[26px] text-[#171312]">
                  {categories[index]}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#120d0b] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.18)]">
            <img
              src={articleImage}
              alt="Article feature"
              className="h-[560px] w-full object-cover"
            />
          </div>

          <div className="max-w-[760px] text-white">
            <p className="text-[15px] uppercase tracking-[0.25em] text-white/75">
              Article • October 2022
            </p>
            <h3 className="mt-5 font-display text-[42px] leading-[1] text-white sm:text-[52px]">
              During the golden hour.
            </h3>
            <div className="mt-7 space-y-4 text-[19px] leading-[1.7] text-white/85">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Metus vulputate eu scelerisque felis imperdiet proin fermentum.
                Cras semper auctor neque vitae tempus quam pellentesque.
              </p>
              <p>
                Elementum sagittis vitae et leo duis. Libero nunc consequat
                interdum varius. Habitant morbi tristique senectus et netus et
                malesuada fames ac.
              </p>
            </div>
            <button className="mt-8 inline-flex items-center justify-center border border-white bg-transparent px-6 py-3 text-[13px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85">
              Read more
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1ee] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="max-w-[520px]">
            <h3 className="font-display text-[46px] leading-[1] text-[#171312] sm:text-[56px]">
              Gifts of the season
            </h3>
            <div className="mt-6 space-y-4 text-[19px] leading-[1.7] text-[#1c1918] opacity-90">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Metus vulputate eu scelerisque felis imperdiet proin fermentum.
              </p>
              <p>
                Cras semper auctor neque vitae tempus quam pellentesque.
                Elementum sagittis vitae et leo duis.
              </p>
            </div>
            <button className="mt-8 inline-flex items-center justify-center border border-[#171312] bg-transparent px-6 py-3 text-[13px] font-medium uppercase tracking-[0.2em] text-[#171312] transition-opacity hover:opacity-75">
              Shop gifts
            </button>
          </div>

          <div className="overflow-hidden shadow-[0_8px_28px_rgba(72,50,38,0.08)]">
            <img
              src={giftsImage}
              alt="Seasonal gifts"
              className="h-[420px] w-full object-cover lg:h-[500px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0e0a09] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.18)]">
            <img
              src={aboutImage}
              alt="About the brand"
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div className="max-w-[600px] text-white">
            <h3 className="font-display text-[42px] leading-[1] text-white sm:text-[50px]">
              What were we made for?
            </h3>
            <div className="mt-7 space-y-4 text-[19px] leading-[1.7] text-white/82">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Metus vulputate eu scelerisque felis imperdiet proin fermentum.
              </p>
              <p>
                Cras semper auctor neque vitae tempus quam pellentesque.
                Elementum sagittis vitae et leo duis. Libero nunc consequat
                interdum varius.
              </p>
            </div>
            <button className="mt-8 inline-flex items-center justify-center border border-white bg-transparent px-6 py-3 text-[13px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85">
              About us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
