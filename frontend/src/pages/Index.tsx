// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Navbar } from "@/components/Navbar";
// import { ArrowRight, Smartphone, Shield, Zap } from "lucide-react";
//
// const features = [
//   {
//     icon: Smartphone,
//     title: "Latest Technology",
//     description: "Experience cutting-edge mobile technology with our latest devices"
//   },
//   {
//     icon: Shield,
//     title: "Quality Assured",
//     description: "Every device undergoes rigorous testing for optimal performance"
//   },
//   {
//     icon: Zap,
//     title: "Fast Performance",
//     description: "Powered by the latest processors for lightning-fast speed"
//   }
// ];
//
// const Index = () => {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//
//       {/* Hero Section */}
//       <section className="pt-32 pb-16 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
//             The Future of Mobile Technology
//           </h1>
//           <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
//             Discover our revolutionary lineup of smartphones, crafted with precision
//             and powered by innovation.
//           </p>
//           <Button className="hover-glow" size="lg">
//             Explore Products <ArrowRight className="ml-2" />
//           </Button>
//         </div>
//       </section>
//
//       {/* Features Section */}
//       <section className="py-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <Card key={index} className="glass-card p-6 hover-glow">
//                 <feature.icon className="h-12 w-12 text-primary mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-gray-400">{feature.description}</p>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//
//       {/* Latest Products Preview */}
//       <section className="py-16 px-4 bg-secondary/30">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gradient mb-8 text-center">
//             Latest Products
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[1, 2, 3].map((item) => (
//               <Card key={item} className="glass-card overflow-hidden hover-glow">
//                 <div className="aspect-square relative bg-gradient-to-br from-primary/20 to-secondary">
//                   <img
//                     src="/placeholder.svg"
//                     alt="Phone"
//                     className="absolute inset-0 w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold mb-2">MobileZone Pro {item}</h3>
//                   <p className="text-gray-400 mb-4">Starting from $999</p>
//                   <Button variant="secondary" className="w-full hover-glow">
//                     Learn More
//                   </Button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };
//
// export default Index;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Smartphone, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Latest Technology",
    description: "Experience cutting-edge mobile technology with our latest devices"
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Every device undergoes rigorous testing for optimal performance"
  },
  {
    icon: Zap,
    title: "Fast Performance",
    description: "Powered by the latest processors for lightning-fast speed"
  }
];

const Index = () => {
  return (
      <div className="min-h-screen bg-gray-50">


        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
              The Future of Mobile Technology
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our revolutionary lineup of smartphones, crafted with precision
              and powered by innovation.
            </p>
            <Button className="hover-glow bg-gray-900 hover:bg-gray-800" size="lg">
              Explore Products <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                  <Card key={index} className="glass-card p-6 hover-glow">
                    <feature.icon className="h-12 w-12 text-gray-700 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Products Preview */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gradient mb-8 text-center">
              Latest Products
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                  <Card key={item} className="glass-card overflow-hidden hover-glow">
                    <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-white">
                      <img
                          src="/placeholder.svg"
                          alt="Phone"
                          className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">MobileZone Pro {item}</h3>
                      <p className="text-gray-600 mb-4">Starting from $999</p>
                      <Button variant="outline" className="w-full hover-glow border-gray-200">
                        Learn More
                      </Button>
                    </div>
                  </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
};

export default Index;