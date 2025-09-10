import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      features: ["Basic data collection", "5GB storage", "Email support"],
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$99",
      period: "per month",
      features: ["Advanced analytics", "50GB storage", "Priority support"],
      cta: "Try Professional",
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited storage", "Dedicated support", "Custom integrations"],
      cta: "Contact Sales"
    }
  ];

  return (
    <Layout
      title="Pricing"
      description="Simple, transparent pricing for all team sizes"
    >
      <PageHero 
        title="Pricing" 
        description="Choose the perfect plan for your research needs" 
      />
      
      <ContentSection>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-lg shadow-md ${plan.featured ? 'ring-2 ring-indigo-600 transform scale-105' : ''}`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-500"> {plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-3 px-4 rounded-md font-medium ${plan.featured ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </ContentSection>
    </Layout>
  );
}