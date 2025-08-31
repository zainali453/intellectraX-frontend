import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Welcome to IntellectraX
          </h1>
          <p className="text-gray-600">
            Your comprehensive learning management platform
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/signin"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Sign In
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Link
            to="/signup"
            className="w-full flex items-center justify-center px-4 py-3 border border-teal-600 text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Create an Account
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Join thousands of teachers and students who are already using
            IntellectraX
          </p>
        </div>

        {/* Features Section */}
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3">
              <div className="text-teal-600 font-semibold mb-1">
                Easy to Use
              </div>
              <p className="text-sm text-gray-500">
                Intuitive interface for seamless learning
              </p>
            </div>
            <div className="text-center p-3">
              <div className="text-teal-600 font-semibold mb-1">Flexible</div>
              <p className="text-sm text-gray-500">
                Learn or teach at your own pace
              </p>
            </div>
            <div className="text-center p-3">
              <div className="text-teal-600 font-semibold mb-1">
                Interactive
              </div>
              <p className="text-sm text-gray-500">
                Engage with students effectively
              </p>
            </div>
            <div className="text-center p-3">
              <div className="text-teal-600 font-semibold mb-1">Secure</div>
              <p className="text-sm text-gray-500">Your data is safe with us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
