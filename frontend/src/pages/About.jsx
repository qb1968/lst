import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function About() {
  return (
    <section className="p-8 max-w-6xl mx-auto text-white space-y-10">
      {/* Section 1 */}
      <div className="bg-gray-900 bg-opacity-70 p-6 rounded shadow-lg flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <img
            src="/images/lst.avif"
            alt="Theater Logo"
            className="w-64 h-auto rounded shadow transition duration-300 hover:scale-105"
          />
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-4xl font-bold">Get to Know Us</h2>
          <p className="text-lg leading-relaxed text-gray-200">
            Established in 1949 as The Curtis Movie Theater, this historic venue
            now offers the best shows in the industry such as Vince Gill, Gene
            Watson, Lorrie Morgan, Del McCoury, Sammy Kershaw, Joe Diffie and
            many more.
            <br />
            <br />A great place to bring the entire family with live shows
            almost every Saturday night!
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-gray-900 bg-opacity-70 p-6 rounded shadow-lg flex flex-col md:flex-row-reverse items-center gap-8">
        <div className="flex-shrink-0">
          <img
            src="/images/lst2.avif"
            alt="Theater Rentals"
            className="w-64 h-auto rounded shadow transition duration-300 hover:scale-105"
          />
        </div>
        <div className="space-y-4 text-center md:text-left">
          <p className="text-lg leading-relaxed text-gray-200">
            Please email us for information on renting the theater for your
            event.  
            <br />
            <br />
            If you are planning a birthday celebration, production or even a
            wedding, we will be happy to help you!
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="bg-gray-900 bg-opacity-70 p-6 rounded shadow-lg flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <img
            src="/images/lst3.avif"
            alt="Visit Us"
            className="w-64 h-auto rounded shadow transition duration-300 hover:scale-105"
          />
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-4xl font-bold">
            Great Music and <br />
            Great Fun for Everyone!
          </h2>
          <p className="text-lg leading-relaxed text-gray-200">
            Come visit us in the Heart of NC!
          </p>
          <div className="flex flex-col items-center md:items-start space-y-2 text-gray-300 text-lg">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-xl text-green-400" />
              <span>101 S. Fayetteville St, Liberty, NC 27298</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-xl text-green-400" />
              <span>(336) 524-6822</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
